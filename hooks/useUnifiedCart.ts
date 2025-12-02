"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from './useAuth'
import { useCart } from './useCart'
import { useGuestCart } from './useGuestCart'

interface CartItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    price: number
    images: Array<{
      id: string
      url: string
      altText?: string
      isPrimary: boolean
    }>
  }
  quantity: number
  price: number
}

interface Cart {
  id?: string
  userId?: string
  items: CartItem[]
  total: number
  itemCount: number
  subtotal: number
  tax: number
  shipping: number
}

export function useUnifiedCart() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const authenticatedCart = useCart()
  const guestCart = useGuestCart()
  const [hasMerged, setHasMerged] = useState(false)

  // Merge guest cart when user logs in
  useEffect(() => {
    const mergeGuestCart = async () => {
      if (isAuthenticated && !hasMerged && guestCart.cart.items.length > 0) {
        try {
          console.log('🔄 Merging guest cart with authenticated cart...')
          const guestCartData = guestCart.getCartForMerge()
          console.log('📦 Guest cart items to merge:', guestCartData)
          
          await authenticatedCart.mergeCart(guestCartData)
          
          // Wait a bit to ensure the cart is fetched after merge
          // This ensures the authenticated cart has the merged items before we clear guest cart
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Refresh the authenticated cart to ensure it's up to date
          await authenticatedCart.refetch()
          
          // Only clear guest cart after we've confirmed the authenticated cart has items
          const authCart = authenticatedCart.cart
          if (authCart && authCart.items && authCart.items.length > 0) {
            console.log('✅ Cart merged successfully, clearing guest cart')
            guestCart.clearCart()
            setHasMerged(true)
          } else {
            console.warn('⚠️ Merge completed but authenticated cart appears empty, keeping guest cart')
          }
        } catch (error) {
          console.error('❌ Error merging guest cart:', error)
          // Don't clear guest cart if merge fails
        }
      } else if (isAuthenticated && !hasMerged && guestCart.cart.items.length === 0) {
        // No guest cart items to merge, just mark as merged
        setHasMerged(true)
      }
    }

    if (!authLoading && isAuthenticated) {
      mergeGuestCart()
    }
  }, [isAuthenticated, hasMerged, guestCart, authenticatedCart, authLoading])

  // Reset merge flag when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setHasMerged(false)
    }
  }, [isAuthenticated])

  // Get current cart (authenticated or guest) - memoized to trigger re-renders
  // Keep guest cart visible during merge transition to prevent cart from disappearing
  const currentCart = useMemo((): Cart => {
    if (isAuthenticated) {
      const authCart = authenticatedCart.cart
      const gCart = guestCart.cart
      const guestItems = Array.isArray(gCart?.items) ? gCart.items : []
      
      // If authenticated but cart is empty/null and guest cart still has items (before merge completes)
      // OR if merge hasn't completed yet, keep showing guest cart
      if ((!authCart || !authCart.items || authCart.items.length === 0) && guestItems.length > 0 && !hasMerged) {
        // Show guest cart during merge transition
        return {
          items: guestItems,
          total: gCart?.total || 0,
          itemCount: gCart?.itemCount || 0,
          subtotal: gCart?.total || 0,
          tax: 0,
          shipping: 0
        }
      }
      
      // After merge completes or if authenticated cart has items, show authenticated cart
      if (authCart && authCart.items && authCart.items.length > 0) {
        return authCart
      }
      
      // Default empty cart
      return {
        items: [],
        total: 0,
        itemCount: 0,
        subtotal: 0,
        tax: 0,
        shipping: 0
      }
    } else {
      const gCart = guestCart.cart
      return {
        items: Array.isArray(gCart?.items) ? gCart.items : [],
        total: gCart?.total || 0,
        itemCount: gCart?.itemCount || 0,
        subtotal: gCart?.total || 0,
        tax: 0,
        shipping: 0
      }
    }
  }, [isAuthenticated, authenticatedCart.cart, guestCart.cart, hasMerged])

  // Add to cart (works for both guest and authenticated)
  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    if (isAuthenticated) {
      return await authenticatedCart.addToCart(productId, quantity)
    } else {
      return await guestCart.addToCart(productId, quantity)
    }
  }, [isAuthenticated, authenticatedCart, guestCart])

  // Update cart item (works for both guest and authenticated)
  const updateCartItem = useCallback(async (productId: string, quantity: number) => {
    if (isAuthenticated) {
      return await authenticatedCart.updateCartItem(productId, quantity)
    } else {
      guestCart.updateCartItem(productId, quantity)
    }
  }, [isAuthenticated, authenticatedCart, guestCart])

  // Remove from cart (works for both guest and authenticated)
  const removeFromCart = useCallback(async (productId: string) => {
    if (isAuthenticated) {
      return await authenticatedCart.removeFromCart(productId)
    } else {
      guestCart.removeFromCart(productId)
    }
  }, [isAuthenticated, authenticatedCart, guestCart])

  // Clear cart (works for both guest and authenticated)
  const clearCart = useCallback(() => {
    if (isAuthenticated) {
      // For authenticated users, we might want to clear the server cart
      // This would require an API endpoint
      console.log('Clear authenticated cart not implemented')
    } else {
      guestCart.clearCart()
    }
  }, [isAuthenticated, guestCart])

  return {
    cart: currentCart,
    loading: isAuthenticated ? authenticatedCart.loading : guestCart.loading,
    error: isAuthenticated ? authenticatedCart.error : null,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refetch: isAuthenticated ? authenticatedCart.refetch : () => {},
    clearError: isAuthenticated ? authenticatedCart.clearError : () => {},
    isAuthenticated,
    hasMerged,
    debugCart: isAuthenticated ? () => {} : guestCart.debugCart
  }
}
