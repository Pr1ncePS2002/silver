import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paymentId = parseInt(params.id);
    if (isNaN(paymentId)) {
      return NextResponse.json({ error: "Invalid payment ID" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: {
          include: {
            orderItems: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payment.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Only completed payments can be refunded" },
        { status: 400 }
      );
    }

    // In a real integration, call the gateway API to issue a refund here.
    // For now, mark as refunded and update related order + stock.

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "REFUNDED" },
    });

    // Update order status and restore stock
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: "REFUNDED" },
    });

    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: payment.orderId },
    });

    await Promise.all(
      orderItems.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        })
      )
    );

    return NextResponse.json({
      message: "Refund processed successfully",
      payment: { id: updatedPayment.id, status: updatedPayment.status },
    });
  } catch (error) {
    console.error("Error processing refund:", error);
    return NextResponse.json(
      { error: "Failed to process refund" },
      { status: 500 }
    );
  }
}
