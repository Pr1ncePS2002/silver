"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Menu, X, Search, Heart } from "lucide-react";
import { useUnifiedCart } from "@/hooks/useUnifiedCart";
import { useUnifiedWishlist } from "@/hooks/useUnifiedWishlist";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cart } = useUnifiedCart();
  const { isAuthenticated } = useAuth();
  const { count: wishlistCount } = useUnifiedWishlist();

  // Debug: Log cart state changes
  console.log('Header render - cart items:', cart?.items?.length || 0);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    // { name: "Blog", href: "/blog" },
    { name: "Track Order", href: "/track" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 light-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/images/Logo.jpeg"
              alt="Logo"
              className="h-10 w-auto rounded-full"
              onError={(e) => {
                console.error("Logo failed to load:", e.currentTarget.src);
                e.currentTarget.src = "/images/logo.png";
              }}
            />

            <span className="font-playfair text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Silver Line
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-purple-600 transition-all duration-300 font-medium relative group text-sm"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-2">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all text-sm bg-white shadow-sm"
                style={{ minWidth: '200px', maxWidth: '300px' }}
              />
            </form>

            {/* Mobile Search Icon */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/wishlist"
              className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors hover:bg-purple-50 rounded-full"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce-gentle light-shadow">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors hover:bg-purple-50 rounded-full"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart && cart.items && cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce-gentle light-shadow">
                  {cart.items.length}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-up bg-white/95 backdrop-blur-sm">
            <form onSubmit={handleSearch} className="px-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all text-sm bg-white shadow-sm"
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-up bg-white/95 backdrop-blur-sm rounded-b-lg">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium px-4 py-2 hover:bg-purple-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
