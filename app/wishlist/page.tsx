"use client"

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Trash2, ShoppingCart, Heart } from 'lucide-react'
import { useUnifiedWishlist } from '@/hooks/useUnifiedWishlist'
import AddToCartButton from '@/components/AddToCartButton'

export default function WishlistPage() {
  const { items, isLoading, error, removeFromWishlist, clearWishlist } = useUnifiedWishlist()
  
  // Ensure items is always an array
  const wishlistItems = Array.isArray(items) ? items : []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl light-shadow border border-gray-100 overflow-hidden">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                      <div className="h-10 bg-gray-200 rounded-full w-32"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error loading wishlist</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h1>
            <p className="text-gray-600 mb-6">
              Save items you love by clicking the heart icon on any product.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-1">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        
        {wishlistItems.length > 0 && (
          <button
            onClick={clearWishlist}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </button>
        )}
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => {
          // Handle both authenticated and guest wishlist item structures
          const productId = typeof item.product.id === 'string' ? item.product.id : item.product.id.toString()
          const productPrice = typeof item.product.price === 'number' ? item.product.price : parseFloat(item.product.price)
          
          // Handle different image structures: images array or fallback
          let imageUrl = "/placeholder.svg"
          if (item.product.images && Array.isArray(item.product.images) && item.product.images.length > 0) {
            // Find primary image or use first image
            const primaryImage = item.product.images.find((img: any) => img.isPrimary) || item.product.images[0]
            if (primaryImage) {
              imageUrl = typeof primaryImage === 'string' ? primaryImage : (primaryImage.url || "/placeholder.svg")
            }
          } else if ((item.product as any).image) {
            // Fallback: check for single image property (backward compatibility)
            imageUrl = (item.product as any).image
          }
          
          // Ensure imageUrl is a valid string
          if (!imageUrl || imageUrl === "" || imageUrl === "null" || imageUrl === "undefined") {
            imageUrl = "/placeholder.svg"
          }

          // Get product description/shortDescription
          const productDescription = (item.product as any).description || (item.product as any).shortDescription || ""
          
          return (
            <div key={item.id} className="group bg-white rounded-2xl light-shadow hover:light-shadow-lg transition-all duration-500 overflow-hidden animate-fade-in border border-gray-100 hover:border-purple-200">
              <Link href={`/product/${productId}`}>
                <div className="relative overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={item.product.name}
                    width={400}
                    height={400}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized={imageUrl.startsWith('http') || imageUrl.startsWith('/uploads')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {/* Delete Icon - replaces heart icon */}
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        removeFromWishlist(productId)
                      }}
                      className="p-2 sm:p-3 bg-white/95 backdrop-blur-sm rounded-full light-shadow hover:bg-white transition-colors hover:scale-110 transform duration-200 border border-red-200 hover:border-red-400"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                    </button>
                  </div>
                  {item.product.stock === 0 && (
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/80 to-pink-400/80 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-semibold text-lg drop-shadow-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4 sm:p-6">
                <Link href={`/product/${productId}`}>
                  <h3 className="font-semibold text-lg sm:text-xl text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {item.product.name}
                  </h3>
                </Link>
                {productDescription && (
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    {productDescription}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ₹{Math.round(productPrice)}
                  </span>
                  <AddToCartButton 
                    productId={productId} 
                    disabled={item.product.stock === 0}
                    className="w-full sm:w-auto flex items-center justify-center space-x-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed light-shadow hover:light-shadow-lg transform hover:scale-105"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Actions */}
      {wishlistItems.length > 0 && (
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      )}
      </div>
      <Footer />
    </div>
  )
}
