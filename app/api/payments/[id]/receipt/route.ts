import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
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
            user: true,
            orderItems: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const amount = parseFloat(payment.amount.toString()).toFixed(2);
    const subtotal = payment.order.orderItems
      .reduce((sum, i) => sum + Number(i.totalPrice), 0)
      .toFixed(2);

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Receipt #${payment.id}</title>
    <style>
      body{font-family: Arial, sans-serif; padding: 24px; color:#111}
      h1{font-size:20px; margin:0 0 12px}
      .muted{color:#555}
      table{width:100%; border-collapse: collapse; margin-top:12px}
      th,td{border:1px solid #ddd; padding:8px; font-size:12px}
      th{text-align:left; background:#f7f7f7}
    </style>
  </head>
  <body>
    <h1>Payment Receipt</h1>
    <div class="muted">Receipt ID: #${payment.id}</div>
    <div class="muted">Order: ${payment.order.orderNumber || payment.order.id}</div>
    <div class="muted">Date: ${payment.createdAt.toISOString()}</div>
    <hr />
    <div><strong>Customer:</strong> ${payment.order.user?.firstName || ''} ${payment.order.user?.lastName || ''} (${payment.order.user?.email || 'N/A'})</div>
    <div><strong>Amount:</strong> ${payment.currency} ${amount}</div>
    <div><strong>Method:</strong> ${payment.paymentMethod}</div>
    <div><strong>Status:</strong> ${payment.status}</div>
    <div><strong>Transaction ID:</strong> ${payment.transactionId || 'N/A'}</div>
    <h3>Items</h3>
    <table>
      <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
      <tbody>
        ${payment.order.orderItems
          .map(
            (i) => `<tr><td>${i.productName}</td><td>${i.quantity}</td><td>${Number(i.price).toFixed(2)}</td><td>${Number(i.totalPrice).toFixed(2)}</td></tr>`
          )
          .join("")}
      </tbody>
    </table>
    <p><strong>Subtotal:</strong> ${subtotal}</p>
  </body>
</html>`;

    return NextResponse.json({ receiptHtml: html });
  } catch (error) {
    console.error("Error generating receipt:", error);
    return NextResponse.json(
      { error: "Failed to generate receipt" },
      { status: 500 }
    );
  }
}
