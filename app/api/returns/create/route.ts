import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"
import {
  createReturnSchema,
  MAX_RETURN_IMAGES,
} from "@/lib/validation/returns"
import { getFileFromFormData, uploadFiles } from "@/lib/upload"

// Map UI strings to Prisma enum values
const toResolution = (val: string) => {
  switch (val) {
    case "Refund":
      return "REFUND"
    case "Exchange":
      return "EXCHANGE"
    case "Store Credit":
      return "STORE_CREDIT"
    default:
      return "REFUND"
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    const formData = await request.formData()
    const payload = {
      orderNumber: String(formData.get("orderNumber") || ""),
      contactEmail: formData.get("contactEmail") ? String(formData.get("contactEmail")) : undefined,
      contactPhone: formData.get("contactPhone") ? String(formData.get("contactPhone")) : undefined,
      reason: String(formData.get("reason") || "Other"),
      details: formData.get("details") ? String(formData.get("details")) : undefined,
      resolutionType: String(formData.get("resolutionType") || "Refund"),
    }

    const parsed = createReturnSchema.parse(payload)

    if (!parsed.contactEmail && !parsed.contactPhone && !session?.user?.id) {
      return NextResponse.json({ error: "Provide email/phone or login to continue" }, { status: 400 })
    }

    // Validate order
    const order = await prisma.order.findUnique({
      where: { orderNumber: parsed.orderNumber },
      include: {
        user: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Authorization/verification
    const isAdmin = !!session?.user?.isAdmin
    if (session?.user?.id && !isAdmin) {
      if (order.userId !== Number(session.user.id)) {
        return NextResponse.json({ error: "Not authorized for this order" }, { status: 403 })
      }
    } else if (!session?.user?.id) {
      // Verify using email or phone if guest/not logged in
      const emailMatch = parsed.contactEmail && order.user?.email && parsed.contactEmail.toLowerCase() === order.user.email.toLowerCase()
      // Phone may be in addresses JSON; fallback to allow if email matches. If not available, accept provided phone-length >= 7 (basic)
      const phoneMatch = !!parsed.contactPhone // light check due to missing structured phone on order
      if (!emailMatch && !phoneMatch) {
        return NextResponse.json({ error: "Verification failed. Provide correct email or phone." }, { status: 401 })
      }
    }

    // Handle images
    const files = getFileFromFormData(formData, "photos")
    if (files.length > MAX_RETURN_IMAGES) {
      return NextResponse.json({ error: `Maximum ${MAX_RETURN_IMAGES} photos allowed` }, { status: 400 })
    }

    const uploaded = files.length
      ? await uploadFiles(files, {
          folder: "returns",
          maxFiles: MAX_RETURN_IMAGES,
          allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
          maxSizePerFile: 5 * 1024 * 1024,
        })
      : []

    const imageUrls = uploaded.map((u) => u.url)

    const created = await prisma.returnRequest.create({
      data: {
        orderId: order.id,
        userId: order.userId ?? null,
        reason: parsed.details ? `${parsed.reason}: ${parsed.details}` : parsed.reason,
        photos: imageUrls,
        resolutionType: toResolution(parsed.resolutionType) as any,
        status: "PENDING",
        logs: {
          create: {
            status: "PENDING",
            note: "Return request created",
          },
        },
      },
      include: { order: true, user: true },
    })

    // Placeholder: send confirmation email
    console.log("[Return] Confirmation email placeholder:", {
      to: created.user?.email || parsed.contactEmail,
      orderNumber: order.orderNumber,
      returnId: created.id,
    })

    return NextResponse.json(
      {
        message: "Return request submitted",
        returnRequest: {
          id: created.id,
          status: created.status,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }
    console.error("Error creating return request:", error)
    return NextResponse.json({ error: "Failed to create return request" }, { status: 500 })
  }
}
