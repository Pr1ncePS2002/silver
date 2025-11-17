import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { approveReturnSchema } from "@/lib/validation/returns"
import { getDelhiveryService, getEnvPickupAddress } from "@/lib/delhivery"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number(params.id)
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

    const body = await request.json().catch(() => ({}))
    const parsed = approveReturnSchema.safeParse(body)
    const note = parsed.success && parsed.data.note ? parsed.data.note : undefined

    const existing = await prisma.returnRequest.findUnique({
      where: { id },
      include: { order: true, user: true },
    })
    if (!existing) return NextResponse.json({ error: "Return not found" }, { status: 404 })

    // Placeholder: trigger pickup creation (return pickup)
    let pickupWaybill: string | null = null
    try {
      const delhivery = getDelhiveryService()
      // For a real implementation, pickup should be from customer's address to warehouse
      const pickup = await delhivery.createPickup({
        ...getEnvPickupAddress(),
        type: "return",
      })
      pickupWaybill = pickup.success ? pickup.warehouseId || "PICKUP_CREATED" : "PICKUP_PENDING"
    } catch (e) {
      pickupWaybill = "PICKUP_PENDING"
    }

    // Update status to APPROVED
    const updated = await prisma.returnRequest.update({
      where: { id },
      data: {
        status: "APPROVED",
        pickupWaybill,
        logs: {
          create: {
            status: "APPROVED",
            note: note || "Return approved. Pickup initiated (placeholder)",
            adminId: Number(session.user.id),
          },
        },
      },
      include: { order: true, user: true },
    })

    // Resolution handling (placeholders)
    let storeCreditCoupon: string | undefined
    if (updated.resolutionType === "REFUND") {
      // Placeholder: integrate Razorpay refund here using payment_id
      console.log("[Return] Razorpay refund placeholder for order", updated.order.orderNumber)
    } else if (updated.resolutionType === "EXCHANGE") {
      // Placeholder: auto-create a new order
      console.log("[Return] Exchange placeholder: create replacement order for", updated.order.orderNumber)
    } else if (updated.resolutionType === "STORE_CREDIT") {
      // Generate one-time coupon equal to order total
      const amount = Number(updated.order.totalAmount)
      const code = `STORECREDIT-${Date.now().toString(36).toUpperCase()}`
      await prisma.coupon.create({
        data: {
          code,
          name: `Store Credit RR#${updated.id}`,
          discountType: "FIXED_AMOUNT",
          discountValue: amount,
          minOrderValue: 0,
          maxDiscount: amount,
          usageLimit: 1,
          perUserLimit: 1,
          isActive: true,
        },
      })
      storeCreditCoupon = code
      await prisma.returnLog.create({
        data: {
          returnRequestId: updated.id,
          status: "APPROVED",
          note: `Store credit coupon generated: ${code}`,
          adminId: Number(session.user.id),
        },
      })
    }

    // Placeholder: notify customer
    console.log("[Return] Notify customer placeholder:", {
      to: updated.user?.email,
      status: updated.status,
      storeCreditCoupon,
    })

    return NextResponse.json({
      message: "Return approved",
      pickupWaybill,
      storeCreditCoupon,
    })
  } catch (error) {
    console.error("Approve return error:", error)
    return NextResponse.json({ error: "Failed to approve return" }, { status: 500 })
  }
}
