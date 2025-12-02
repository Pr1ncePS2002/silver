"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Loader2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { api } from "@/lib/api"

interface OrderItem {
  id: string
  productId: string
  productName: string
  productSku: string
  productImage: string | null
  quantity: number
  price: number
  totalPrice: number
  product?: {
    id: string
    name: string
    image: string
  } | null
}

interface Order {
  id: string
  orderNumber: string
  status: string
  user: {
    id: string
    name: string
    email: string
    phone: string | null
  } | null
  items: OrderItem[]
  pricing: {
    subtotal: number
    taxAmount: number
    shippingCost: number
    discountAmount: number
    totalAmount: number
  }
  shipping: {
    method: string
    trackingNumber: string | null
    carrier: string | null
    status: string
    estimatedDelivery: string | null
    shippedAt: string | null
    deliveredAt: string | null
    notes: string | null
  } | null
  payment: {
    method: string
    status: string
    amount: number
    transactionId: string | null
    gateway: string | null
    paidAt: string | null
  } | null
  addresses?: {
    billing?: any
    shipping?: any
  } | null
  customerNotes?: string | null
  createdAt: string
  updatedAt: string
}

export default function TrackingContent() {
  const [formData, setFormData] = useState({
    orderId: "",
    contact: "",
  })
  const [order, setOrder] = useState<Order | null>(null)
  const [ordersList, setOrdersList] = useState<Order[]>([])
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [error, setError] = useState("")
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [searchMode, setSearchMode] = useState<"single" | "all">("single")

  const fetchOrder = useCallback(async () => {
    if (!formData.orderId.trim() || !formData.contact.trim()) return

    try {
      setLoading(true)
      setError("")
      setOrdersList([])
      setOrder(null)

      const response = await api.orders.trackOrder(formData.orderId.trim(), formData.contact.trim())

      if (response.error) {
        throw new Error(response.error)
      }

      if (response.data) {
        setOrder(response.data)
        setOrdersList([])
        setSearchMode("single")
        setLastRefresh(new Date())
        // Auto-refresh if order is not delivered
        if (response.data.status !== "DELIVERED" && response.data.status !== "CANCELLED") {
          setAutoRefresh(true)
        } else {
          setAutoRefresh(false)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to track order")
      setOrder(null)
      setOrdersList([])
      setAutoRefresh(false)
    } finally {
      setLoading(false)
    }
  }, [formData.orderId, formData.contact])

  const fetchAllOrders = useCallback(async () => {
    if (!formData.contact.trim()) return

    try {
      setLoadingOrders(true)
      setError("")
      setOrder(null)
      setOrdersList([])

      const response = await api.orders.getByContact(formData.contact.trim())

      if (response.error) {
        throw new Error(response.error)
      }

      if (response.data?.orders) {
        setOrdersList(response.data.orders)
        setOrder(null)
        setSearchMode("all")
        setAutoRefresh(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders")
      setOrdersList([])
    } finally {
      setLoadingOrders(false)
    }
  }, [formData.contact])

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
  }

  // Render order details (reusable for both single order and expanded list items)
  const renderOrderDetails = (orderItem: Order) => (
    <div className="space-y-6">
      {/* Order Items with Images */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
        <div className="space-y-4">
          {orderItem.items && orderItem.items.length > 0 ? (
            orderItem.items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.productImage || item.product?.image || "/placeholder.jpg"}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{item.productName}</h4>
                  {item.productSku && (
                    <p className="text-sm text-gray-500">SKU: {item.productSku}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-gray-900">₹{item.totalPrice.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No items found</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 mt-6 pt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">₹{orderItem.pricing.subtotal.toFixed(2)}</span>
          </div>
          {orderItem.pricing.shippingCost > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">₹{orderItem.pricing.shippingCost.toFixed(2)}</span>
            </div>
          )}
          {orderItem.pricing.discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-₹{orderItem.pricing.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{orderItem.pricing.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Timeline */}
      {orderItem.shipping && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tracking Information</h3>
          {(orderItem.shipping.trackingNumber || orderItem.shipping.method) && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
              {orderItem.shipping.method && (
                <p className="text-sm text-blue-800">
                  <strong>Shipping Method:</strong> {orderItem.shipping.method.replace("_", " ")}
                </p>
              )}
              {orderItem.shipping.trackingNumber && (
                <p className="text-sm text-blue-800">
                  <strong>Tracking Number:</strong> {orderItem.shipping.trackingNumber}
                </p>
              )}
              {orderItem.shipping.carrier && (
                <p className="text-sm text-blue-800">
                  <strong>Carrier:</strong> {orderItem.shipping.carrier}
                </p>
              )}
              {orderItem.shipping.estimatedDelivery && (
                <p className="text-sm text-blue-800">
                  <strong>Estimated Delivery:</strong>{" "}
                  {new Date(orderItem.shipping.estimatedDelivery).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
              )}
            </div>
          )}
          <div className="space-y-3">
            {generateTimeline(orderItem).map((timelineItem) => (
              <div key={timelineItem.status} className="flex items-start gap-4">
                <div className={`flex-shrink-0 mt-1 ${timelineItem.isCompleted ? "" : "opacity-40"}`}>
                  {getStatusIcon(timelineItem.status)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h4 className={`font-semibold ${timelineItem.isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                      {formatStatus(timelineItem.status)}
                    </h4>
                    {timelineItem.date && (
                      <span className={`text-sm ${timelineItem.isCompleted ? "text-gray-600" : "text-gray-400"}`}>
                        {timelineItem.date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Information */}
      {orderItem.payment && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Information</h3>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Payment Method</span>
              <span className="text-sm font-medium text-gray-900 capitalize">
                {orderItem.payment.method.replace("_", " ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Payment Status</span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  orderItem.payment.status === "PAID" || orderItem.payment.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : orderItem.payment.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {orderItem.payment.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount</span>
              <span className="text-sm font-bold text-gray-900">₹{orderItem.payment.amount.toFixed(2)}</span>
            </div>
            {orderItem.payment.transactionId && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                <p className="text-xs font-mono text-gray-900 break-all">{orderItem.payment.transactionId}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shipping Address */}
      {orderItem.addresses?.shipping && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h3>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 space-y-1 text-sm">
            <p className="font-medium text-gray-900">{(orderItem.addresses.shipping as any).name}</p>
            {(orderItem.addresses.shipping as any).company && (
              <p>{(orderItem.addresses.shipping as any).company}</p>
            )}
            <p>{(orderItem.addresses.shipping as any).address1}</p>
            {(orderItem.addresses.shipping as any).address2 && (
              <p>{(orderItem.addresses.shipping as any).address2}</p>
            )}
            <p>
              {(orderItem.addresses.shipping as any).city}, {(orderItem.addresses.shipping as any).state}{" "}
              {(orderItem.addresses.shipping as any).zipCode || (orderItem.addresses.shipping as any).postalCode}
            </p>
          </div>
        </div>
      )}
    </div>
  )

  // Auto-refresh tracking every 30 seconds if order is not delivered
  useEffect(() => {
    if (!autoRefresh || !order || order.status === "DELIVERED" || order.status === "CANCELLED") {
      return
    }

    const interval = setInterval(() => {
      fetchOrder()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, order, fetchOrder])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setExpandedOrderId(null)
    
    if (!formData.contact.trim()) {
      setError("Please enter your email or phone number")
      return
    }

    // If order ID is provided, search for specific order
    if (formData.orderId.trim()) {
      fetchOrder()
    } else {
      // Otherwise, fetch all orders for this contact
      fetchAllOrders()
    }
  }

  const handleManualRefresh = () => {
    if (order) {
      fetchOrder()
    }
  }

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toUpperCase()
    switch (normalizedStatus) {
      case "CONFIRMED":
      case "PROCESSING":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "SHIPPED":
      case "IN_TRANSIT":
        return <Truck className="w-5 h-5 text-purple-500" />
      case "OUT_FOR_DELIVERY":
        return <MapPin className="w-5 h-5 text-orange-500" />
      case "DELIVERED":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "CANCELLED":
      case "REFUNDED":
        return <Clock className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toUpperCase()
    switch (normalizedStatus) {
      case "CONFIRMED":
      case "PROCESSING":
        return "bg-green-50 text-green-800 border-green-200"
      case "PENDING":
        return "bg-yellow-50 text-yellow-800 border-yellow-200"
      case "SHIPPED":
      case "IN_TRANSIT":
        return "bg-purple-50 text-purple-800 border-purple-200"
      case "OUT_FOR_DELIVERY":
        return "bg-orange-50 text-orange-800 border-orange-200"
      case "DELIVERED":
        return "bg-green-50 text-green-800 border-green-200"
      case "CANCELLED":
      case "REFUNDED":
        return "bg-red-50 text-red-800 border-red-200"
      default:
        return "bg-gray-50 text-gray-800 border-gray-200"
    }
  }

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  // Generate timeline from order status
  const generateTimeline = (order: Order): Array<{
    status: string
    isCompleted: boolean
    isCurrent: boolean
    date: string
  }> => {
    const timeline: Array<{
      status: string
      isCompleted: boolean
      isCurrent: boolean
      date: string
    }> = []
    const statusOrder = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED"]
    const currentStatusIndex = statusOrder.indexOf(order.status.toUpperCase())

    statusOrder.forEach((status, index) => {
      const isCompleted = index <= currentStatusIndex
      const isCurrent = index === currentStatusIndex

      let date = ""
      if (status === "PENDING" || status === "CONFIRMED") {
        date = new Date(order.createdAt).toLocaleString()
      } else if (status === "SHIPPED" && order.shipping?.shippedAt) {
        date = new Date(order.shipping.shippedAt).toLocaleString()
      } else if (status === "DELIVERED" && order.shipping?.deliveredAt) {
        date = new Date(order.shipping.deliveredAt).toLocaleString()
      } else if (isCurrent) {
        date = new Date(order.updatedAt).toLocaleString()
      }

      timeline.push({
        status,
        isCompleted,
        isCurrent,
        date,
      })
    })

    return timeline
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
          📦 Track Your Order
        </h1>
        <p className="text-gray-600">Enter your order details to track your jewelry delivery</p>
      </div>

      {/* Tracking Form */}
      <div className="bg-white rounded-2xl p-8 light-shadow border border-gray-100 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order ID (Optional)</label>
              <input
                type="text"
                name="orderId"
                value={formData.orderId}
                onChange={handleInputChange}
                placeholder="e.g., EJ001234 (Leave empty to see all orders)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to view all your orders</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email or Phone *</label>
              <input
                type="text"
                name="contact"
                required
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="your@email.com or +1234567890"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || loadingOrders}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 light-shadow"
          >
            {(loading || loadingOrders) ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>{formData.orderId.trim() ? "Track Order" : "View All Orders"}</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>

      {/* Orders List */}
      {ordersList.length > 0 && (
        <div className="space-y-4 mb-8">
          <div className="bg-white rounded-2xl p-6 light-shadow border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your Orders ({ordersList.length})
            </h2>
            <p className="text-gray-600">Click on any order to view details</p>
          </div>
          
          {ordersList.map((orderItem) => {
            const isExpanded = expandedOrderId === orderItem.id
            return (
              <div
                key={orderItem.id}
                className="bg-white rounded-2xl border border-gray-100 light-shadow overflow-hidden"
              >
                <button
                  onClick={() => toggleOrderDetails(orderItem.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        Order #{orderItem.orderNumber}
                      </h3>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          orderItem.status,
                        )}`}
                      >
                        {formatStatus(orderItem.status)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <p>
                        Placed: {new Date(orderItem.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p>Items: {orderItem.items?.length || 0}</p>
                      <p className="font-semibold text-gray-900">
                        Total: ₹{orderItem.pricing.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-200 p-6">
                    {renderOrderDetails(orderItem)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Single Order Details */}
      {order && (
        <div className="space-y-6">
          {/* Order Header with Status */}
          <div className="bg-white rounded-2xl p-6 light-shadow border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order #{order.orderNumber}</h2>
                <p className="text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {autoRefresh && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live tracking</span>
                  </div>
                )}
                <button
                  onClick={handleManualRefresh}
                  disabled={loading}
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh tracking"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                </button>
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                    order.status,
                  )}`}
                >
                  {getStatusIcon(order.status)}
                  <span className="ml-2">{formatStatus(order.status)}</span>
                </span>
              </div>
            </div>
            {lastRefresh && (
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* All Order Items with Images */}
          <div className="bg-white rounded-2xl p-8 light-shadow border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Items</h3>
            <div className="space-y-4">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.productImage || item.product?.image || "/placeholder.jpg"}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{item.productName}</h4>
                      {item.productSku && (
                        <p className="text-sm text-gray-500">SKU: {item.productSku}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-gray-900">₹{item.totalPrice.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No items found</p>
              )}
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 mt-6 pt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{order.pricing.subtotal.toFixed(2)}</span>
              </div>
              {order.pricing.shippingCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">₹{order.pricing.shippingCost.toFixed(2)}</span>
                </div>
              )}
              {order.pricing.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.pricing.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{order.pricing.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="bg-white rounded-2xl p-8 light-shadow border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Tracking Timeline</h3>
            {(order.shipping?.trackingNumber || order.shipping?.method) && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                {order.shipping.method && (
                  <p className="text-sm text-blue-800">
                    <strong>Shipping Method:</strong> {order.shipping.method.replace("_", " ")}
                  </p>
                )}
                {order.shipping.trackingNumber && (
                  <p className="text-sm text-blue-800">
                    <strong>Tracking Number:</strong> {order.shipping.trackingNumber}
                  </p>
                )}
                {order.shipping.carrier && (
                  <p className="text-sm text-blue-800">
                    <strong>Carrier:</strong> {order.shipping.carrier}
                  </p>
                )}
                {order.shipping.estimatedDelivery && (
                  <p className="text-sm text-blue-800">
                    <strong>Estimated Delivery:</strong>{" "}
                    {new Date(order.shipping.estimatedDelivery).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                )}
                {order.shipping.shippedAt && (
                  <p className="text-sm text-blue-800">
                    <strong>Shipped On:</strong>{" "}
                    {new Date(order.shipping.shippedAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                )}
                {order.shipping.deliveredAt && (
                  <p className="text-sm text-green-800">
                    <strong>Delivered On:</strong>{" "}
                    {new Date(order.shipping.deliveredAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                )}
              </div>
            )}
            <div className="space-y-4">
              {generateTimeline(order).map((timelineItem, index) => (
                <div key={timelineItem.status} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 mt-1 ${timelineItem.isCompleted ? "" : "opacity-40"}`}>
                    {getStatusIcon(timelineItem.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h4 className={`font-semibold ${timelineItem.isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                        {formatStatus(timelineItem.status)}
                      </h4>
                      {timelineItem.date && (
                        <span className={`text-sm ${timelineItem.isCompleted ? "text-gray-600" : "text-gray-400"}`}>
                          {timelineItem.date}
                        </span>
                      )}
                    </div>
                    {timelineItem.isCurrent && order.shipping?.notes && (
                      <p className="text-sm text-gray-600 mt-1">{order.shipping.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            {order.user && (
              <div className="bg-white rounded-2xl p-8 light-shadow border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Information</h3>
                <div className="space-y-3 text-gray-600">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="font-medium text-gray-900">{order.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-900">{order.user.email}</p>
                  </div>
                  {order.user.phone && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <p className="font-medium text-gray-900">{order.user.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                  {order.customerNotes && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Order Notes</p>
                      <p className="font-medium text-gray-900">{order.customerNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Information */}
            {order.payment && (
              <div className="bg-white rounded-2xl p-8 light-shadow border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h3>
                <div className="space-y-3 text-gray-600">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                    <p className="font-medium text-gray-900 capitalize">{order.payment.method.replace("_", " ")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        order.payment.status === "PAID" || order.payment.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : order.payment.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.payment.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
                    <p className="font-medium text-gray-900 text-lg">₹{order.payment.amount.toFixed(2)}</p>
                  </div>
                  {order.payment.gateway && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Payment Gateway</p>
                      <p className="font-medium text-gray-900 capitalize">{order.payment.gateway}</p>
                    </div>
                  )}
                  {order.payment.transactionId && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                      <p className="font-medium text-gray-900 font-mono text-sm break-all">{order.payment.transactionId}</p>
                    </div>
                  )}
                  {order.payment.paidAt && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Paid On</p>
                      <p className="font-medium text-gray-900">
                        {new Date(order.payment.paidAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Addresses Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shipping Address */}
            {order.addresses?.shipping && (
              <div className="bg-white rounded-2xl p-8 light-shadow border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h3>
                <div className="text-gray-600 space-y-2">
                  <p className="font-medium text-gray-900">{(order.addresses.shipping as any).name}</p>
                  {(order.addresses.shipping as any).company && (
                    <p>{(order.addresses.shipping as any).company}</p>
                  )}
                  <p>{(order.addresses.shipping as any).address1}</p>
                  {(order.addresses.shipping as any).address2 && (
                    <p>{(order.addresses.shipping as any).address2}</p>
                  )}
                  <p>
                    {(order.addresses.shipping as any).city}, {(order.addresses.shipping as any).state}{" "}
                    {(order.addresses.shipping as any).zipCode || (order.addresses.shipping as any).postalCode}
                  </p>
                  {(order.addresses.shipping as any).country && (
                    <p>{(order.addresses.shipping as any).country}</p>
                  )}
                  {(order.addresses.shipping as any).phone && (
                    <p className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-500">Phone: </span>
                      <span className="font-medium">{(order.addresses.shipping as any).phone}</span>
                    </p>
                  )}
                  {(order.addresses.shipping as any).email && (
                    <p>
                      <span className="text-sm text-gray-500">Email: </span>
                      <span className="font-medium">{(order.addresses.shipping as any).email}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Billing Address */}
            {order.addresses?.billing && (
              <div className="bg-white rounded-2xl p-8 light-shadow border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Billing Address</h3>
                <div className="text-gray-600 space-y-2">
                  <p className="font-medium text-gray-900">{(order.addresses.billing as any).name}</p>
                  {(order.addresses.billing as any).company && (
                    <p>{(order.addresses.billing as any).company}</p>
                  )}
                  <p>{(order.addresses.billing as any).address1}</p>
                  {(order.addresses.billing as any).address2 && (
                    <p>{(order.addresses.billing as any).address2}</p>
                  )}
                  <p>
                    {(order.addresses.billing as any).city}, {(order.addresses.billing as any).state}{" "}
                    {(order.addresses.billing as any).zipCode || (order.addresses.billing as any).postalCode}
                  </p>
                  {(order.addresses.billing as any).country && (
                    <p>{(order.addresses.billing as any).country}</p>
                  )}
                  {(order.addresses.billing as any).phone && (
                    <p className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-500">Phone: </span>
                      <span className="font-medium">{(order.addresses.billing as any).phone}</span>
                    </p>
                  )}
                  {(order.addresses.billing as any).email && (
                    <p>
                      <span className="text-sm text-gray-500">Email: </span>
                      <span className="font-medium">{(order.addresses.billing as any).email}</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
