import { NextRequest } from 'next/server'
import { verifyWebhookSignature } from '@/lib/razorpay'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { createDelhiveryShipment } from '@/lib/services/delhivery'

// Helper: mark payment + order confirmed (idempotent)
async function markPaymentCaptured(razorpayPaymentId: string, razorpayOrderId: string) {
  const payment = await prisma.payment.findFirst({
    where: { transactionId: razorpayOrderId },
  })
  if (!payment) {
    logger.warn('webhook.paymentNotFound', { razorpayOrderId })
    return null
  }
  if (payment.status === 'COMPLETED') {
    logger.info('webhook.paymentAlreadyCompleted', { paymentId: payment.id })
    return payment
  }
  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: 'COMPLETED',
      paidAt: new Date(),
      gatewayResponse: {
        ...(typeof payment.gatewayResponse === 'object' ? payment.gatewayResponse : {}),
        paymentId: razorpayPaymentId,
        capturedAt: new Date().toISOString(),
      },
    },
  })
  await prisma.order.update({
    where: { id: updated.orderId },
    data: { status: 'CONFIRMED' },
  })
  return updated
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-razorpay-signature') || ''
  const rawBody = await req.text()
  if (!verifyWebhookSignature(rawBody, signature)) {
    logger.warn('webhook.signature.invalid')
    return new Response('Invalid signature', { status: 400 })
  }

  let event: any
  try {
    event = JSON.parse(rawBody)
  } catch (e) {
    logger.error('webhook.json.parse.error', { message: (e as Error).message })
    return new Response('Bad payload', { status: 400 })
  }

  logger.info('webhook.event.received', { event: event.event })

  if (event.event === 'payment.captured') {
    const paymentEntity = event.payload?.payment?.entity
    const razorpayOrderId = paymentEntity?.order_id
    const razorpayPaymentId = paymentEntity?.id
    const notes = paymentEntity?.notes || {}
    const orderIdRaw = notes.orderId
    const orderId = orderIdRaw ? parseInt(orderIdRaw, 10) : undefined

    if (!razorpayOrderId || !razorpayPaymentId) {
      logger.warn('webhook.payment.captured.missingFields')
      return new Response('Missing payment fields', { status: 200 })
    }

    // Mark payment captured (idempotent)
    const payment = await markPaymentCaptured(razorpayPaymentId, razorpayOrderId)

    // Attempt shipment if we have orderId
    if (orderId) {
      try {
        const shipmentResult = await createDelhiveryShipment({ orderId })
        if (shipmentResult.success) {
          logger.info('webhook.shipment.created', { orderId, trackingNumber: shipmentResult.trackingNumber })
        } else {
          logger.error('webhook.shipment.failed', { orderId, error: shipmentResult.error })
        }
      } catch (e) {
        logger.error('webhook.shipment.exception', { orderId, error: (e as Error).message })
      }
    } else {
      logger.warn('webhook.shipment.orderIdMissing', { razorpayOrderId })
    }
  }

  return new Response('OK', { status: 200 })
}

export const dynamic = 'force-dynamic'