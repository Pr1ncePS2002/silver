'use client'

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProductCard from "@/components/ProductCard"
import ProductCardSkeleton from "@/components/ProductCardSkeleton"
import { useProducts } from "@/hooks/useProducts"
import { Star, Truck, Shield, Headphones } from "lucide-react"
import { useRouter } from "next/navigation"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { useState, useEffect } from "react"
import Image from "next/image"

const metadata = {
  title: "Silver Line - Handcrafted Jewelry for Every Occasion",
  description: "Discover Silver Line's exquisite collection of handcrafted jewelry. Shop rings, necklaces, earrings, and more. Free shipping, premium quality, and lifetime warranty.",
  keywords: "jewelry, silver, rings, necklaces, earrings, handcrafted, shop, Silver Line, buy jewelry online",
  openGraph: {
    title: "Silver Line - Handcrafted Jewelry for Every Occasion",
    description: "Discover Silver Line's exquisite collection of handcrafted jewelry. Shop rings, necklaces, earrings, and more.",
    url: "https://silverline925.in/",
    siteName: "Silver Line",
    images: [
      {
        url: "/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Silver Line Jewelry Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function Home() {
  const router = useRouter()
  const { products, loading, error } = useProducts({ 
    page: 1, 
    limit: 4, 
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  // Fetch 8 most recent products for banner slider
  const { products: bannerProducts, loading: bannerLoading } = useProducts({ 
    page: 1, 
    limit: 8, 
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaApi, setEmblaApi] = useState<CarouselApi | undefined>(undefined);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryCarouselApi, setCategoryCarouselApi] = useState<CarouselApi | undefined>(undefined);
  
  // Fetch categories with latest products
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch('/api/categories?includeProducts=true&includeCounts=true');
        const data = await response.json();
        
        // Get first product image for each category (as latest)
        const categoriesWithLatestProduct = data.map((category: any) => {
          const firstProduct = category.products && category.products.length > 0
            ? category.products[0]
            : null;
          
          return {
            ...category,
            latestProductImage: firstProduct?.image || category.imageUrl || "/placeholder.svg",
            latestProductId: firstProduct?.id || null
          };
        }).filter((cat: any) => cat.productCount > 0); // Only show categories with products
        
        setCategories(categoriesWithLatestProduct);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Create dynamic slider images from recent products
  const sliderImages = bannerProducts.map(product => {
    const primaryImage = product.images.find(img => img.isPrimary);
    return {
      src: primaryImage?.url || product.images[0]?.url || "/placeholder.svg",
      alt: product.name,
      productId: product.id
    };
  });

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
      emblaApi.on("select", onSelect);
      setSelectedIndex(emblaApi.selectedScrollSnap());
      return () => {
        emblaApi.off("select", onSelect);
      };
    }
  }, [emblaApi]);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Banner Slider */}
      <section className="w-full mb-4 sm:mb-6">
        <div className="relative w-full">
          {bannerLoading ? (
            <div className="aspect-[4/3] sm:aspect-[3/2] lg:aspect-[32/9] flex items-center justify-center bg-gray-100" style={{ minHeight: '250px' }}>
              <div className="text-center px-4">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 border-b-2 border-purple-600 mx-auto mb-3 sm:mb-4"></div>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">Loading featured products...</p>
              </div>
            </div>
          ) : sliderImages.length > 0 ? (
            <Carousel className="w-full relative overflow-hidden" setApi={setEmblaApi}>
              <CarouselContent className="-ml-0">
                {sliderImages.map((img, i) => (
                  <CarouselItem key={i} className="pl-0 aspect-[4/3] sm:aspect-[3/2] lg:aspect-[32/9] flex items-center justify-center w-full">
                    <div 
                      className="relative w-full h-full cursor-pointer group touch-pan-y"
                      onClick={() => router.push(`/product/${img.productId}`)}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        style={{ minHeight: '250px' }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 group-active:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-full">
                          <span className="text-gray-800 font-semibold text-xs sm:text-sm md:text-base">View Product</span>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex left-2 md:left-4" />
              <CarouselNext className="hidden sm:flex right-2 md:right-4" />
            </Carousel>
          ) : (
            <div className="aspect-[4/3] sm:aspect-[3/2] lg:aspect-[32/9] flex items-center justify-center bg-gray-100" style={{ minHeight: '250px' }}>
              <div className="text-center px-4">
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">No products available</p>
              </div>
            </div>
          )}
          
          {/* Dot Indicators: Only show previous, current, and next */}
          {sliderImages.length > 0 && (
            <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3 mt-2 sm:mt-3 md:mt-4 px-4">
              {sliderImages.map((_, idx) => {
                // Only show the previous, current, and next dot
                if (Math.abs(selectedIndex - idx) > 2) return null;
                return (
                  <button
                    key={idx}
                    onClick={() => emblaApi && emblaApi.scrollTo(idx)}
                    className={`h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5 rounded-full transition-all duration-300 ${selectedIndex === idx ? 'bg-gray-700 sm:bg-gray-500' : 'bg-gray-300'} focus:outline-none active:scale-110`}
                    aria-label={`Go to slide ${idx + 1}`}
                    type="button"
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Category Carousel Section */}
      {categories.length > 0 && (
        <section className="py-10 sm:py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              Discover Your Style
            </h2>
            </div>
            
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <>
                {/* Mobile: 2-row horizontal scroll */}
                <div className="block sm:hidden">
                  <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                    <div className="inline-flex flex-col gap-3" style={{ width: 'max-content' }}>
                      {/* Split categories into 2 rows */}
                      <div className="flex gap-3">
                        {categories.filter((_, index) => index % 2 === 0).map((category) => (
                          <div
                            key={category.id}
                            className="group cursor-pointer flex-shrink-0"
                            style={{ width: '140px' }}
                            onClick={() => router.push(`/shop?category=${category.id}`)}
                          >
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 light-shadow hover:light-shadow-lg transition-all duration-300 group-hover:scale-105 mb-2">
                              <Image
                                src={category.latestProductImage}
                                alt={category.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <h3 className="text-gray-800 font-semibold text-xs text-center group-hover:text-purple-600 transition-colors duration-300">
                              {category.name}
                            </h3>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        {categories.filter((_, index) => index % 2 === 1).map((category) => (
                          <div
                            key={category.id}
                            className="group cursor-pointer flex-shrink-0"
                            style={{ width: '140px' }}
                            onClick={() => router.push(`/shop?category=${category.id}`)}
                          >
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 light-shadow hover:light-shadow-lg transition-all duration-300 group-hover:scale-105 mb-2">
                              <Image
                                src={category.latestProductImage}
                                alt={category.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <h3 className="text-gray-800 font-semibold text-xs text-center group-hover:text-purple-600 transition-colors duration-300">
                              {category.name}
                            </h3>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop: Carousel with navigation */}
                <div className="hidden sm:block">
                  <div className="relative">
                    <Carousel 
                      className="w-full" 
                      setApi={setCategoryCarouselApi}
                      opts={{
                        align: "start",
                        loop: false,
                      }}
                    >
                      <CarouselContent className="-ml-2 md:-ml-4">
                        {categories.map((category) => (
                          <CarouselItem 
                            key={category.id} 
                            className="pl-2 md:pl-4 basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                          >
                            <div
                              className="group cursor-pointer"
                              onClick={() => router.push(`/shop?category=${category.id}`)}
                            >
                              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 light-shadow hover:light-shadow-lg transition-all duration-300 group-hover:scale-105 mb-2 sm:mb-3">
                                <Image
                                  src={category.latestProductImage}
                                  alt={category.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <h3 className="text-gray-800 font-semibold text-xs sm:text-sm text-center group-hover:text-purple-600 transition-colors duration-300">
                                {category.name}
                              </h3>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="hidden md:flex -left-12" />
                      <CarouselNext className="hidden md:flex -right-12" />
                    </Carousel>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-5 left-5 sm:top-10 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-yellow-200/40 rounded-full blur-xl animate-float"></div>
          <div
            className="absolute top-16 right-10 sm:top-32 sm:right-20 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-pink-200/40 rounded-full blur-xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-10 left-1/4 sm:bottom-20 sm:left-1/4 w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-blue-200/40 rounded-full blur-xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/3 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-200/40 rounded-full blur-xl animate-float"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-slide-up">
            <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 mb-4 sm:mb-5 md:mb-6 drop-shadow-sm leading-tight">
              ✨Timeless Elegance✨
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-7 md:mb-8 max-w-2xl mx-auto px-2 sm:px-0">
              Discover our exquisite collection of handcrafted jewelry, where every piece tells a story of beauty and
              sophistication. 💎
            </p>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 rounded-full hover:from-purple-600 hover:to-pink-600 active:from-purple-700 active:to-pink-700 transition-all duration-300 text-sm sm:text-base md:text-lg font-semibold light-shadow-lg hover:light-shadow-xl transform hover:scale-105 active:scale-95" onClick={() => router.push("/shop")}>
              🛍️ Shop Collection
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-gradient-to-br from-gray-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-2 sm:px-0">
              ✨ Featured Collection ✨
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">
              Explore our carefully curated selection of premium jewelry pieces, each designed to celebrate life's most
              precious moments. 💎
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 sm:py-10 md:py-12 px-4">
              <p className="text-red-600 text-sm sm:text-base">Failed to load products: {error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
 
      {/* Features */}
      <section className="py-10 sm:py-12 md:py-16 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center animate-fade-in group hover:transform hover:scale-105 active:scale-95 transition-all duration-300 px-2 sm:px-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 light-shadow group-hover:light-shadow-lg">
                <Truck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-1.5 sm:mb-2 text-gray-800 text-xs sm:text-sm md:text-base">🚚 Free Shipping</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-tight sm:leading-normal">Free shipping on orders over ₹5000</p>
            </div>
            <div className="text-center animate-fade-in group hover:transform hover:scale-105 active:scale-95 transition-all duration-300 px-2 sm:px-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 light-shadow group-hover:light-shadow-lg">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-1.5 sm:mb-2 text-gray-800 text-xs sm:text-sm md:text-base">🛡️ Lifetime Warranty</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-tight sm:leading-normal">Lifetime warranty on all jewelry</p>
            </div>
            <div className="text-center animate-fade-in group hover:transform hover:scale-105 active:scale-95 transition-all duration-300 px-2 sm:px-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 light-shadow group-hover:light-shadow-lg">
                <Star className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-1.5 sm:mb-2 text-gray-800 text-xs sm:text-sm md:text-base">⭐ Premium Quality</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-tight sm:leading-normal">Handcrafted with finest materials</p>
            </div>
            <div className="text-center animate-fade-in group hover:transform hover:scale-105 active:scale-95 transition-all duration-300 px-2 sm:px-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 light-shadow group-hover:light-shadow-lg">
                <Headphones className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-1.5 sm:mb-2 text-gray-800 text-xs sm:text-sm md:text-base">🎧 24/7 Support</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-tight sm:leading-normal">Expert customer support</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}