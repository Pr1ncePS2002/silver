import axios from 'axios'
import crypto from 'crypto'
import { logger } from '@/lib/logger'

// Delhivery API Configuration
const DELHIVERY_BASE_URL = process.env.DELHIVERY_BASE_URL || "https://api.delhivery.com";
const DELHIVERY_API_KEY = process.env.DELHIVERY_API_KEY!
const DELHIVERY_CLIENT_NAME = process.env.DELHIVERY_CLIENT_NAME || 'ElegantJewelry'

// Delhivery API Endpoints (subset + inferred pin-code endpoint)
const DELHIVERY_ENDPOINTS = {
  CREATE_PACKAGE: '/api/cmu/create.json',
  TRACK_PACKAGE: '/api/v1/packages/json/',
  CANCEL_PACKAGE: '/api/p/edit',
  GET_SERVICES: '/api/kinko/v1/invoice/services', // not currently used for serviceability
  CREATE_PICKUP: '/api/backend/createpickup',
  PINCODE_SERVICEABILITY: '/c/api/pin-code', // inferred common endpoint (may vary by account tier)
}

// Types for Delhivery API
export interface DelhiveryAddress {
  name: string
  address: string
  city: string
  state: string
  pin: string
  country: string
  phone: string
  email?: string
}

export interface DelhiveryPackage {
  name: string
  weight: string // in grams
  dimensions?: {
    length: string // in cm
    width: string // in cm
    height: string // in cm
  }
  price: string // in INR
  quantity: number
  description?: string
  sku?: string
}

export interface DelhiveryShipmentRequest {
  pickup_location: DelhiveryAddress
  shipments: Array<{
    name: string
    add: string
    city: string
    state: string
    country: string
    pin: string
    phone: string
    email?: string
    order: string // order number
    products_desc: string
    weight: string
    payment_mode: 'Pre-paid' | 'COD'
    collectable_amount?: string // for COD
    return_name?: string
    return_add?: string
    return_city?: string
    return_state?: string
    return_country?: string
    return_pin?: string
    return_phone?: string
    return_email?: string
  }>
}

export interface DelhiveryShipmentResponse {
  success: boolean
  packages: Array<{
    waybill: string // tracking number
    refnum: string // reference number
    cod_amount?: string
    payment_mode: string
    serviceable: boolean
    status: string
    message?: string
  }>
  error?: string
}

export interface DelhiveryTrackingResponse {
  success: boolean
  tracking_data: {
    shipment_data: Array<{
      waybill: string
      current_status: string
      current_status_type: string
      current_status_location: string
      current_status_time: string
      expected_delivery_date?: string
      delivered_at?: string
      origin?: string
      destination?: string
      weight?: string
      volume_weight?: string
      payment_mode?: string
      cod_amount?: string
      customer_name?: string
      customer_phone?: string
      customer_address?: string
      origin_pin?: string
      destination_pin?: string
      origin_city?: string
      destination_city?: string
      origin_state?: string
      destination_state?: string
      origin_country?: string
      destination_country?: string
      return_pin?: string
      return_city?: string
      return_state?: string
      return_country?: string
      return_address?: string
      return_name?: string
      return_phone?: string
      return_email?: string
      pieces?: string
      product?: string
      product_amount?: string
      origin_address?: string
      destination_address?: string
      origin_country_code?: string
      destination_country_code?: string
      origin_lat?: string
      origin_lng?: string
      destination_lat?: string
      destination_lng?: string
      origin_zone?: string
      destination_zone?: string
      origin_hub?: string
      destination_hub?: string
      origin_area?: string
      destination_area?: string
      scans?: Array<{
        status: string
        status_type: string
        status_location: string
        status_time: string
        instruction: string
      }>
    }>
  }
  error?: string
}

// Types for Delhivery Pickup API
export interface DelhiveryPickupRequest {
  name: string
  address: string
  city: string
  state: string
  pin: string
  country: string
  phone: string
  email?: string
  type?: string // 'pickup' or 'return'
}

export interface DelhiveryPickupResponse {
  success: boolean
  warehouseId?: string
  error?: string
}

// Delhivery Service Class
export class DelhiveryService {
  private apiKey: string
  private clientName: string
  private baseURL: string

  // Cache for serviceability lookups to cut down API calls
  private serviceabilityCache: Map<string, { serviceable: boolean; lastChecked: number }> = new Map()

  constructor() {
    this.apiKey = DELHIVERY_API_KEY
    this.clientName = DELHIVERY_CLIENT_NAME
    this.baseURL = DELHIVERY_BASE_URL

    if (!this.apiKey) {
      throw new Error('Delhivery API key is required')
    }
  }

  /**
   * Create a pickup location (warehouse) with Delhivery
   */
  async createPickup(pickupData: DelhiveryPickupRequest): Promise<DelhiveryPickupResponse> {
    try {
      const payload = {
        name: pickupData.name,
        add: pickupData.address,
        city: pickupData.city,
        state: pickupData.state,
        country: pickupData.country,
        pin: pickupData.pin,
        phone: pickupData.phone,
        email: pickupData.email || '',
        type: pickupData.type || 'pickup',
      }

      const response = await this.makeRequest<any>(
        DELHIVERY_ENDPOINTS.CREATE_PICKUP,
        'POST',
        payload
      )

      logger.info('delhivery.createPickup.response', { response })

      // Check if warehouse was created successfully
      if (response && response.success && response.warehouse_id) {
        return {
          success: true,
          warehouseId: response.warehouse_id,
        }
      }

      // Handle error cases
      const errorMessage = response?.rmk || 
                          response?.error || 
                          response?.message || 
                          'Failed to create pickup location'

      return {
        success: false,
        error: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage),
      }
    } catch (error) {
      logger.error('delhivery.createPickup.error', { error })
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create pickup location',
      }
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<T> {
    try {
      let url = `${this.baseURL}${endpoint}`
      // Delhivery requires client name and format for create API
      if (endpoint === DELHIVERY_ENDPOINTS.CREATE_PACKAGE) {
        const sep = url.includes('?') ? '&' : '?'
        url = `${url}${sep}client=${encodeURIComponent(this.clientName)}&format=json`
      }
      const config: any = {
        method,
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Accept': 'application/json',
        },
        timeout: 30000, // 30 seconds timeout
      }

      if (method === 'POST' && data) {
        // For CMU create, Delhivery expects urlencoded: format=json&client=<>&data=<json>
        if (endpoint === DELHIVERY_ENDPOINTS.CREATE_PACKAGE) {
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        } else {
          config.headers['Content-Type'] = 'application/json'
        }
        config.data = data
      }

      const response = await axios(url, config)
      return response.data
    } catch (error: any) {
      logger.error('delhivery.api.error', { endpoint, method, message: error.message, data: error.response?.data })
      throw new Error(`Delhivery API Error: ${error.response?.data?.error || error.message}`)
    }
  }

  /**
   * Check serviceability for a destination PIN code.
   * Falls back to optimistic true if endpoint not available or errors (to avoid blocking orders).
   */
  async checkServiceability(pin: string): Promise<boolean> {
    const cached = this.serviceabilityCache.get(pin)
    const now = Date.now()
    if (cached && (now - cached.lastChecked) < 1000 * 60 * 30) { // 30 min cache
      return cached.serviceable
    }
    try {
      const url = `${DELHIVERY_ENDPOINTS.PINCODE_SERVICEABILITY}?pin=${encodeURIComponent(pin)}`
      const response: any = await this.makeRequest<any>(url, 'GET')
      // Normalization heuristic
      const serviceable = !!(response?.delivery_code?.length || response?.success || response?.Serviceable || response?.serviceable)
      this.serviceabilityCache.set(pin, { serviceable, lastChecked: now })
      return serviceable
    } catch (e) {
      logger.warn('delhivery.serviceability.check.failed', { pin, error: (e as Error).message })
      // Fail-open: assume serviceable, caller can still rely on createShipment serviceable flag
      this.serviceabilityCache.set(pin, { serviceable: true, lastChecked: now })
      return true
    }
  }

  /**
   * Create a shipment with Delhivery
   */
  /**
 * Create a shipment with Delhivery
 */
async createShipment(shipmentData: DelhiveryShipmentRequest): Promise<DelhiveryShipmentResponse> {
  try {
    // Map pickup_location to expected schema (Delhivery uses "add" instead of "address")
    const structuredData = {
      pickup_location: {
        name: shipmentData.pickup_location.name,
        add: (shipmentData.pickup_location as any).add || shipmentData.pickup_location.address,
        city: shipmentData.pickup_location.city,
        state: shipmentData.pickup_location.state,
        country: shipmentData.pickup_location.country,
        pin: shipmentData.pickup_location.pin,
        phone: shipmentData.pickup_location.phone,
        email: shipmentData.pickup_location.email,
      },
      shipments: shipmentData.shipments,
    }

    // Wrap data in urlencoded format expected by Delhivery CMU API
    const payload = new URLSearchParams()
    payload.set('format', 'json')
    payload.set('client', this.clientName)
    payload.set('data', JSON.stringify(structuredData))

    // Make the API call
    const response = await this.makeRequest<any>(
      DELHIVERY_ENDPOINTS.CREATE_PACKAGE,
      'POST',
      payload
    )

    // ✅ Success handling
    if (response && response.packages && response.packages.length > 0) {
      return {
        success: true,
        packages: response.packages.map((pkg: any) => ({
          waybill: pkg.waybill,
          refnum: pkg.refnum,
          cod_amount: pkg.cod_amount,
          payment_mode: pkg.payment_mode,
          serviceable: pkg.serviceable === 'true' || pkg.serviceable === true,
          status: pkg.status,
          message: pkg.message || pkg.remarks,
        })),
      }
    }

    // ❌ Error normalization (if no packages or response.error)
    const normalizedError =
      response?.rmk ||
      response?.error ||
      response?.message ||
      (response?.packages?.[0]?.remarks || 'Delhivery API returned an unknown error')

    logger.error('delhivery.createShipment.failure', { response })

    return {
      success: false,
      packages: [],
      error: typeof normalizedError === 'string' ? normalizedError : JSON.stringify(normalizedError),
    }
  } catch (error) {
    logger.error('delhivery.createShipment.error', { error })
    return {
      success: false,
      packages: [],
      error: error instanceof Error ? error.message : 'Failed to create shipment',
    }
  }
}

  /**
   * Create a return / reverse shipment (RTO or customer return).
   * Mirrors createShipment but caller must provide proper return fields.
   */
  async createReturnShipment(shipmentData: DelhiveryShipmentRequest): Promise<DelhiveryShipmentResponse> {
    // For now delegate to createShipment; differentiation could include special flags.
    return this.createShipment(shipmentData)
  }


  /**
   * Track a shipment
   */
  async trackShipment(waybill: string): Promise<DelhiveryTrackingResponse> {
    try {
      const response = await this.makeRequest<any>(
        `${DELHIVERY_ENDPOINTS.TRACK_PACKAGE}${waybill}`,
        'GET'
      )

      if (response && response.ShipmentData && response.ShipmentData.length > 0) {
        return {
          success: true,
          tracking_data: {
            shipment_data: response.ShipmentData.map((shipment: any) => ({
              waybill: shipment.Waybill,
              current_status: shipment.CurrentStatus,
              current_status_type: shipment.CurrentStatusType,
              current_status_location: shipment.CurrentStatusLocation,
              current_status_time: shipment.CurrentStatusTime,
              expected_delivery_date: shipment.ExpectedDeliveryDate,
              delivered_at: shipment.DeliveredAt,
              origin: shipment.Origin,
              destination: shipment.Destination,
              weight: shipment.Weight,
              volume_weight: shipment.VolumetricWeight,
              payment_mode: shipment.PaymentMode,
              cod_amount: shipment.CODAmount,
              customer_name: shipment.Consignee,
              customer_phone: shipment.ConsigneeContact,
              customer_address: shipment.ConsigneeAddress,
              origin_pin: shipment.OriginPinCode,
              destination_pin: shipment.DestinationPinCode,
              origin_city: shipment.OriginCity,
              destination_city: shipment.DestinationCity,
              origin_state: shipment.OriginState,
              destination_state: shipment.DestinationState,
              origin_country: shipment.OriginCountry,
              destination_country: shipment.DestinationCountry,
              return_pin: shipment.ReturnPinCode,
              return_city: shipment.ReturnCity,
              return_state: shipment.ReturnState,
              return_country: shipment.ReturnCountry,
              return_address: shipment.ReturnAddress,
              return_name: shipment.ReturnName,
              return_phone: shipment.ReturnContact,
              return_email: shipment.ReturnEmail,
              pieces: shipment.Pieces,
              product: shipment.Product,
              product_amount: shipment.ProductAmount,
              origin_address: shipment.OriginAddress,
              destination_address: shipment.DestinationAddress,
              scans: shipment.Scans?.ScanDetails?.map((scan: any) => ({
                status: scan.ScanStatus,
                status_type: scan.ScanType,
                status_location: scan.ScanLocation,
                status_time: scan.ScanDateTime,
                instruction: scan.Instruction,
              })) || [],
            })),
          },
        }
      } else {
        return {
          success: false,
          tracking_data: { shipment_data: [] },
          error: 'No tracking data found',
        }
      }
    } catch (error) {
      logger.error('delhivery.trackShipment.error', { waybill, error })
      return {
        success: false,
        tracking_data: { shipment_data: [] },
        error: error instanceof Error ? error.message : 'Failed to track shipment',
      }
    }
  }

  /**
   * Cancel a shipment
   */
  async cancelShipment(waybill: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await this.makeRequest<any>(
        `${DELHIVERY_ENDPOINTS.CANCEL_PACKAGE}`,
        'POST',
        {
          waybill,
          cancellation_reason: 'Order cancelled by customer',
        }
      )

      if (response && response.success) {
        return {
          success: true,
          message: response.message || 'Shipment cancelled successfully',
        }
      } else {
        return {
          success: false,
          error: response.error || 'Failed to cancel shipment',
        }
      }
    } catch (error) {
      logger.error('delhivery.cancelShipment.error', { waybill, error })
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel shipment',
      }
    }
  }
}

// Singleton instance
let delhiveryServiceInstance: DelhiveryService | null = null

export function getDelhiveryService(): DelhiveryService {
  if (!delhiveryServiceInstance) {
    delhiveryServiceInstance = new DelhiveryService()
  }
  return delhiveryServiceInstance
}

export default DelhiveryService

// Read pickup location from environment for consistency with Delhivery ClientWarehouse
export function getEnvPickupAddress(): DelhiveryAddress {
  const sanitizePhone = (p?: string) => {
    const digits = (p || '').replace(/\D/g, '')
    return digits.slice(-10) || '9999999999'
  }
  return {
    name: process.env.DELHIVERY_PICKUP_NAME || 'Elegant Jewelry Store',
    address: process.env.DELHIVERY_PICKUP_ADDRESS || '123 Jewelry Street, Commercial Area',
    city: process.env.DELHIVERY_PICKUP_CITY || 'Mumbai',
    state: process.env.DELHIVERY_PICKUP_STATE || 'Maharashtra',
    pin: process.env.DELHIVERY_PICKUP_PIN || '400001',
    country: process.env.DELHIVERY_PICKUP_COUNTRY || 'India',
    phone: sanitizePhone(process.env.DELHIVERY_PICKUP_PHONE || '+919999999999'),
    email: process.env.DELHIVERY_PICKUP_EMAIL || 'support@elegantjewelry.com',
  }
}

// Razorpay instance
// (Razorpay-related code removed; see lib/razorpay.ts for payment functions)
