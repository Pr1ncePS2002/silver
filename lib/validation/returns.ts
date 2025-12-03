import { z } from "zod"

export const ReturnReasonEnum = z.enum([
  "Wrong product delivered",
  "Damaged",
  "Quality issue",
  "Size exchange",
  "Other",
])

export const ReturnResolutionEnum = z.enum([
  "Refund",
  "Exchange",
  "Store Credit",
])

export const createReturnSchema = z.object({
  orderNumber: z.string().min(1, "Order ID is required"),
  contactEmail: z.string().email().optional(),
  contactPhone: z
    .string()
    .regex(/^[0-9+\-()\s]{7,20}$/,
      "Enter a valid phone number")
    .optional(),
  reason: ReturnReasonEnum,
  details: z.string().max(1000).optional(),
  resolutionType: ReturnResolutionEnum,
})

export const approveReturnSchema = z.object({
  // For future: allow admin to optionally pass pickup or refund details
  note: z.string().max(500).optional(),
})

export const rejectReturnSchema = z.object({
  reason: z.string().min(2, "Rejection reason required").max(500),
})

export type CreateReturnInput = z.infer<typeof createReturnSchema>
export type ApproveReturnInput = z.infer<typeof approveReturnSchema>
export type RejectReturnInput = z.infer<typeof rejectReturnSchema>

export const MAX_RETURN_IMAGES = 4