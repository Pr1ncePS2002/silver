import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contact = searchParams.get("contact"); // email or phone

    if (!contact) {
      return NextResponse.json(
        { error: "Contact (email or phone) is required" },
        { status: 400 }
      );
    }

    // Normalize contact for matching
    const normalizedContact = contact.trim().toLowerCase();
    const contactIsEmail = normalizedContact.includes("@");
    const contactNormalized = normalizedContact.replace(/\D/g, "");

    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where: contactIsEmail
        ? { email: { equals: normalizedContact, mode: "insensitive" } }
        : { phone: { contains: contactNormalized } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });

    if (!user) {
      // Return empty array instead of error if user not found
      return NextResponse.json({ orders: [] });
    }

    // Verify contact matches exactly (email or phone)
    const userEmail = user.email?.toLowerCase() || "";
    const userPhone = user.phone?.replace(/\D/g, "") || "";

    const emailMatch = contactIsEmail && userEmail === normalizedContact;
    const phoneMatch = !contactIsEmail && userPhone === contactNormalized;

    if (!emailMatch && !phoneMatch) {
      return NextResponse.json({ orders: [] });
    }

    // Get all orders for this user
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
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
      orderBy: { createdAt: "desc" },
    });

    // Transform orders for response
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
      },
      items: order.orderItems.map((item) => ({
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
      shipping: order.shipping ? {
        method: order.shipping.method,
        cost: parseFloat(order.shipping.cost.toString()),
        trackingNumber: order.shipping.trackingNumber,
        carrier: order.shipping.carrier,
        status: order.shipping.status,
        estimatedDelivery: order.shipping.estimatedDelivery,
        shippedAt: order.shipping.shippedAt,
        deliveredAt: order.shipping.deliveredAt,
        notes: order.shipping.notes,
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
      updatedAt: order.updatedAt,
    }));

    return NextResponse.json({ orders: transformedOrders });
  } catch (error) {
    console.error("Error fetching orders by contact:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

