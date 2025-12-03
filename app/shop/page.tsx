import { Suspense } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ShopContent from "@/components/ShopContent"

export const metadata = {
  title: "Shop - Elegant Jewelry Collection",
  description: "Browse our complete collection of handcrafted jewelry. Filter by category, price, and metal type.",
}

function ShopContentSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-16 text-center">
        <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
      </div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Suspense fallback={<ShopContentSkeleton />}>
        <ShopContent />
      </Suspense>
      <Footer />
    </div>
  )
}
