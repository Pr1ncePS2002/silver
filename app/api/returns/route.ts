import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
// Avoid importing model type to prevent client-gen mismatch issues

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") // PENDING|APPROVED|REJECTED|COMPLETED|all
    const take = Math.min(Number(searchParams.get("limit") || 50), 100)
    const page = Math.max(Number(searchParams.get("page") || 1), 1)
    const skip = (page - 1) * take

    const where: any = {}
    if (status && status !== "all") where.status = status.toUpperCase()

    const [rows, count] = await Promise.all([
      prisma.returnRequest.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          order: { select: { id: true, orderNumber: true, totalAmount: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.returnRequest.count({ where }),
    ])
    const data = rows.map((r: any) => ({
      id: r.id,
      orderId: r.orderId,
      orderNumber: r.order?.orderNumber ?? null,
      user: r.user
        ? { id: r.user.id, firstName: r.user.firstName, lastName: r.user.lastName, email: r.user.email }
        : null,
      reason: r.reason,
      photos: r.photos,
      resolutionType: r.resolutionType,
      status: r.status,
      rejectionReason: r.rejectionReason,
      pickupWaybill: r.pickupWaybill,
      refundId: r.refundId,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }))

    const totalPages = Math.ceil(count / take)
    return NextResponse.json({
      returns: data,
      pagination: { page, limit: take, totalCount: count, totalPages },
    })
  } catch (error) {
    console.error("List returns error:", error)
    return NextResponse.json({ error: "Failed to fetch returns" }, { status: 500 })
  }
}
