"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from './useAuth'
import { useWishlist } from './useWishlist'
import { useGuestWishlist } from './useGuestWishlist'
import { api } from '@/lib/api'

interface WishlistItem {
  id: number | string
  product: {
    id: number | string
    name: string
    price: number
    stock: number
    category: {
      id: number
      name: string
    }
    images: Array<{
      id: number
      url: string
      altText?: string
      isPrimary: boolean
    }>
  }
  addedAt: string
}

export function useUnifiedWishlist() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const authenticatedWishlist = useWishlist()
  const guestWishlist = useGuestWishlist()
  const [hasMerged, setHasMerged] = useState(false)

  // Merge guest wishlist when user logs in
  useEffect(() => {
    const mergeGuestWishlist = async () => {
      if (isAuthenticated && !hasMerged && guestWishlist.items.length > 0) {
        try {
          // Add all guest wishlist items to authenticated wishlist
          for (const item of guestWishlist.items) {
            try {
              await api.wishlist.addItem(item.productId)
            } catch (error) {
              console.error(`Error adding product ${item.productId} to wishlist:`, error)
            }
          }
          
          // Clear guest wishlist after merging
          guestWishlist.clearWishlist()
          
          // Refresh authenticated wishlist
          await authenticatedWishlist.fetchWishlist()
          
          setHasMerged(true)
        } catch (error) {
          console.error('Error merging guest wishlist:', error)
        }
      }
    }

    if (!authLoading) {
      mergeGuestWishlist()
    }
  }, [isAuthenticated, hasMerged, guestWishlist, authenticatedWishlist, authLoading])

  // Reset merge flag when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setHasMerged(false)
    }
  }, [isAuthenticated])

  // Get current wishlist (authenticated or guest) - memoized to trigger re-renders
  const currentWishlist = useMemo(() => {
    if (isAuthenticated) {
      const authItems = authenticatedWishlist.items || []
      return {
        items: Array.isArray(authItems) ? authItems : [],
        isLoading: authenticatedWishlist.isLoading,
        error: authenticatedWishlist.error,
        count: authenticatedWishlist.count || 0,
      }
    } else {
      const guestItems = guestWishlist.items || []
      return {
        items: Array.isArray(guestItems) ? guestItems : [],
        isLoading: guestWishlist.loading,
        error: null,
        count: guestWishlist.count || 0,
      }
    }
  }, [isAuthenticated, authenticatedWishlist.items, authenticatedWishlist.isLoading, authenticatedWishlist.error, authenticatedWishlist.count, guestWishlist.items, guestWishlist.loading, guestWishlist.count])

  // Toggle wishlist item (works for both guest and authenticated)
  const toggleWishlistItem = useCallback(async (productId: string) => {
    if (isAuthenticated) {
      return await authenticatedWishlist.toggleWishlistItem(productId)
    } else {
      return await guestWishlist.toggleWishlistItem(productId)
    }
  }, [isAuthenticated, authenticatedWishlist, guestWishlist])

  // Remove item from wishlist
  const removeFromWishlist = useCallback(async (productId: string) => {
    if (isAuthenticated) {
      return await authenticatedWishlist.removeFromWishlist(productId)
    } else {
      guestWishlist.removeFromWishlist(productId)
      return true
    }
  }, [isAuthenticated, authenticatedWishlist, guestWishlist])

  // Clear wishlist
  const clearWishlist = useCallback(async () => {
    if (isAuthenticated) {
      return await authenticatedWishlist.clearWishlist()
    } else {
      guestWishlist.clearWishlist()
      return true
    }
  }, [isAuthenticated, authenticatedWishlist, guestWishlist])

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId: string) => {
    if (isAuthenticated) {
      return authenticatedWishlist.isInWishlist(productId)
    } else {
      return guestWishlist.isInWishlist(productId)
    }
  }, [isAuthenticated, authenticatedWishlist, guestWishlist])

  // Check wishlist status (for authenticated users)
  const checkWishlistStatus = useCallback(async (productId: string) => {
    if (isAuthenticated) {
      return await authenticatedWishlist.checkWishlistStatus(productId)
    } else {
      // For guest users, check local state (synchronous)
      const isInWishlist = guestWishlist.isInWishlist(productId)
      return Promise.resolve(isInWishlist)
    }
  }, [isAuthenticated, authenticatedWishlist, guestWishlist])

  return {
    // State
    items: currentWishlist.items,
    isLoading: currentWishlist.isLoading,
    error: currentWishlist.error,
    count: currentWishlist.count,
    
    // Actions
    toggleWishlistItem,
    removeFromWishlist,
    clearWishlist,
    checkWishlistStatus,
    isInWishlist,
    fetchWishlist: authenticatedWishlist.fetchWishlist,
  }
}
