// Test script for Delhivery createPickup functionality
// Run with: npx tsx test-delhivery-pickup.ts

// IMPORTANT: Load environment variables FIRST before any other imports
import dotenv from 'dotenv'
dotenv.config()

// Verify environment variables are loaded
console.log('Environment check:')
console.log('- DELHIVERY_API_KEY exists:', !!process.env.DELHIVERY_API_KEY)
console.log('- DELHIVERY_API_KEY value:', process.env.DELHIVERY_API_KEY)
console.log('- DELHIVERY_BASE_URL:', process.env.DELHIVERY_BASE_URL)
console.log('')

// Now import after env is loaded
import { getDelhiveryService, getEnvPickupAddress } from './lib/delhivery'

async function testCreatePickup() {
  try {
    console.log('Testing Delhivery createPickup functionality...')
    
    // Get pickup address from environment
    const pickupAddress = getEnvPickupAddress()
    console.log('Pickup address from environment:', pickupAddress)
    
    // Initialize Delhivery service
    const delhiveryService = getDelhiveryService()
    console.log('Delhivery service initialized')
    
    // Test create pickup
    console.log('Creating pickup location with Delhivery...')
    const result = await delhiveryService.createPickup({
      name: pickupAddress.name,
      address: pickupAddress.address,
      city: pickupAddress.city,
      state: pickupAddress.state,
      pin: pickupAddress.pin,
      country: pickupAddress.country,
      phone: pickupAddress.phone,
      email: pickupAddress.email,
      type: 'pickup',
    })
    
    console.log('Create pickup result:', result)
    
    if (result.success) {
      console.log('✅ SUCCESS: Pickup location created successfully')
      console.log('Warehouse ID:', result.warehouseId)
    } else {
      console.log('❌ FAILED: Could not create pickup location')
      console.log('Error:', result.error)
    }
    
  } catch (error) {
    console.error('❌ ERROR in test:', (error as Error).message)
  }
}

// Run the test
testCreatePickup()