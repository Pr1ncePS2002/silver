export type ReturnStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED"
export type ReturnResolutionType = "REFUND" | "EXCHANGE" | "STORE_CREDIT"

export interface ReturnUser {
  id: number
  firstName: string
  lastName: string
  email: string
}

export interface ReturnItem {
  id: number
  orderId: number
  orderNumber: string
  user: ReturnUser | null
  reason: string
  photos: string[]
  resolutionType: ReturnResolutionType
  status: ReturnStatus
  rejectionReason?: string | null
  pickupWaybill?: string | null
  refundId?: string | null
  createdAt: string
  updatedAt: string
}

export interface ReturnsResponse {
  returns: ReturnItem[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
  }
}

export interface ReturnLogItem {
  id: number
  returnRequestId: number
  status: ReturnStatus
  note?: string | null
  adminId?: number | null
  createdAt: string
}