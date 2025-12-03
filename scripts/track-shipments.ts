/**
 * Poll in-transit Delhivery shipments and update statuses.
 * Intended for scheduled execution (e.g., cron every 2-3 hours).
 */
import { prisma } from '@/lib/db'
import { trackDelhiveryShipment } from '@/lib/services/delhivery'
import { logger } from '@/lib/logger'

async function run() {
  const candidates = await prisma.shipping.findMany({
    where: {
      status: { in: ['PROCESSING', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'] },
      trackingNumber: { not: null },
    },
    take: 50, // batch size
  })

  logger.info('tracking.batch.start', { count: candidates.length })

  for (const ship of candidates) {
    if (!ship.trackingNumber) continue
    try {
      const result = await trackDelhiveryShipment(ship.trackingNumber)
      if (!result.success) {
        logger.warn('tracking.item.failed', { trackingNumber: ship.trackingNumber, error: result.error })
      }
    } catch (e) {
      logger.error('tracking.item.exception', { trackingNumber: ship.trackingNumber, error: (e as Error).message })
    }
  }

  logger.info('tracking.batch.complete')
}

run().catch(err => {
  logger.error('tracking.batch.crash', { error: err.message })
  process.exit(1)
})