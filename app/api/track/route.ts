import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    const contact = searchParams.get("contact"); // email or phone

    if (!orderNumber || !contact) {
      return NextResponse.json(
        { error: "Order number and contact (email or phone) are required" },
        { status: 400 }
      );
    }

    // Find order by order number
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        orderItems: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { sortOrder: "asc" },
                  take: 1,
                },
              },
            },
          },
        },
        shipping: true,
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Verify contact matches (email or phone)
    const normalizedContact = contact.trim().toLowerCase();
    const userEmail = order.user?.email?.toLowerCase() || "";
    const userPhone = order.user?.phone?.replace(/\D/g, "") || ""; // Remove non-digits
    const contactNormalized = normalizedContact.replace(/\D/g, "");
    const contactIsEmail = normalizedContact.includes("@");

    const emailMatch = contactIsEmail && userEmail === normalizedContact;
    const phoneMatch = !contactIsEmail && userPhone === contactNormalized;

    if (!emailMatch && !phoneMatch) {
      return NextResponse.json(
        { error: "Order not found. Please verify your order number and contact information." },
        { status: 404 }
      );
    }

    // Track shipment in real-time if tracking number exists
    let shippingStatus = order.shipping?.status;
    let trackingNotes = order.shipping?.notes;

    if (order.shipping?.trackingNumber && order.shipping.carrier === "Delhivery") {
      try {
        const { trackDelhiveryShipment } = await import("@/lib/services/delhivery");
        const trackResult = await trackDelhiveryShipment(order.shipping.trackingNumber);
        
        if (trackResult.success && trackResult.trackingData) {
          // Refresh shipping data after tracking update
          const updatedShipping = await prisma.shipping.findUnique({
            where: { orderId: order.id },
          });
          if (updatedShipping) {
            shippingStatus = updatedShipping.status;
            trackingNotes = updatedShipping.notes;
          }
        }
      } catch (error) {
        console.error("Error tracking shipment:", error);
        // Continue with existing data if tracking fails
      }
    }

    // Get updated order with latest shipping status
    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        shipping: true,
      },
    });

    // Transform order for response
    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: updatedOrder?.status || order.status,
      user: order.user ? {
        id: order.user.id,
        name: `${order.user.firstName} ${order.user.lastName}`,
        email: order.user.email,
        phone: order.user.phone,
      } : null,
      items: order.orderItems.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productSku: item.productSku,
        productImage: item.productImage || item.product?.images[0]?.url || "/placeholder.jpg",
        quantity: item.quantity,
        price: parseFloat(item.price.toString()),
        totalPrice: parseFloat(item.totalPrice.toString()),
        product: item.product ? {
          id: item.product.id,
          name: item.product.name,
          image: item.product.images[0]?.url || "/placeholder.jpg",
        } : null,
      })),
      pricing: {
        subtotal: parseFloat(order.subtotal.toString()),
        taxAmount: parseFloat(order.taxAmount.toString()),
        shippingCost: parseFloat(order.shippingCost.toString()),
        discountAmount: parseFloat(order.discountAmount.toString()),
        totalAmount: parseFloat(order.totalAmount.toString()),
      },
      addresses: {
        billing: order.billingAddress,
        shipping: order.shippingAddress,
      },
      shipping: updatedOrder?.shipping ? {
        method: updatedOrder.shipping.method,
        cost: parseFloat(updatedOrder.shipping.cost.toString()),
        trackingNumber: updatedOrder.shipping.trackingNumber,
        carrier: updatedOrder.shipping.carrier,
        status: shippingStatus || updatedOrder.shipping.status,
        estimatedDelivery: updatedOrder.shipping.estimatedDelivery,
        shippedAt: updatedOrder.shipping.shippedAt,
        deliveredAt: updatedOrder.shipping.deliveredAt,
        notes: trackingNotes || updatedOrder.shipping.notes,
      } : null,
      payment: order.payments[0] ? {
        method: order.payments[0].paymentMethod,
        status: order.payments[0].status,
        amount: parseFloat(order.payments[0].amount.toString()),
        transactionId: order.payments[0].transactionId,
        gateway: order.payments[0].gateway,
        paidAt: order.payments[0].paidAt,
      } : null,
      customerNotes: order.customerNotes,
      createdAt: order.createdAt,
      updatedAt: updatedOrder?.updatedAt || order.updatedAt,
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error("Error tracking order:", error);
    return NextResponse.json(
      { error: "Failed to track order" },
      { status: 500 }
    );
  }
}

