import { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BlogCard from "@/components/BlogCard"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Blog - Silver Line",
  description: "Discover jewelry styling tips, fashion advice, and insights from Silver Line. Learn how to style your jewelry collection with elegance and confidence.",
  keywords: "jewelry blog, styling tips, fashion advice, jewelry care, Silver Line blog",
}

// Blog posts data - in a real app, this would come from a database or CMS
const blogPosts = [
  {
    id: "necklace-styling-tips-minimal-premium-jewelry",
    title: "Necklace Styling Tips for Women Who Love Minimal Yet Premium Jewelry",
    excerpt: "Discover elegant necklace styling tips for women who prefer minimal yet premium jewelry. Learn how to pair refined designs with everyday and festive outfits.",
    image: "/placeholder.svg",
    date: new Date().toISOString(),
    category: "Jewelry Tips",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-slide-up">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Blog
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Discover jewelry styling tips, fashion advice, and insights to help you create timeless, elegant looks.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">No blog posts available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

