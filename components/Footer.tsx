import Link from "next/link"
import { Facebook, Instagram, Mail, Phone, MapPin, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-800 via-gray-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-blue-900/20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-full flex items-center justify-center light-shadow">
                <span className="text-white font-bold text-xs sm:text-sm">SL</span>
              </div>
              <span className="font-playfair text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Silver Line
              </span>
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
              Discover our exquisite collection of handcrafted jewelry. Each piece is carefully designed to celebrate
              life's precious moments with timeless elegance. ✨
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a
                href="https://www.facebook.com/people/silverline925/100081127009371/?mibextid=LQQJ4d"
                className="text-gray-400 hover:text-blue-300 transition-colors transform hover:scale-110 duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="https://www.instagram.com/silver.line925/"
                className="text-gray-400 hover:text-pink-300 transition-colors transform hover:scale-110 duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="https://wa.me/+919512765399"
                className="text-gray-400 hover:text-green-300 transition-colors transform hover:scale-110 duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-purple-300 text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block text-sm sm:text-base"
                >
                 Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block text-sm sm:text-base"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block text-sm sm:text-base"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block text-sm sm:text-base"
                >
                   Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-blue-300 text-sm sm:text-base">Legal</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block text-sm sm:text-base"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block text-sm sm:text-base"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block text-sm sm:text-base"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block text-sm sm:text-base"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cancellation-policy"
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block text-sm sm:text-base"
                >
                  Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-pink-300 text-sm sm:text-base">Contact Info</h3>
            <ul className="space-y-2.5 sm:space-y-3">
              <li className="flex items-start sm:items-center space-x-2 sm:space-x-3 text-gray-400 hover:text-white transition-colors">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <a href="mailto:silver.line9250@gmail.com" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm break-words">silver.line9250@gmail.com</a>
              </li>
              <li className="flex items-start sm:items-center space-x-2 sm:space-x-3 text-gray-400 hover:text-white transition-colors">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <a href="tel:+919512765399" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">+91 9512765399</a>
              </li>
              <li className="flex items-start sm:items-center space-x-2 sm:space-x-3 text-gray-400 hover:text-white transition-colors">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <a href="https://www.google.com/maps/place/Blossom+Aura/@22.6774876,72.8793417,17z/data=!3m1!4b1!4m6!3m5!1s0x395e5b3c654679bd:0x7fec0936b8b30f97!8m2!3d22.6774876!4d72.8819166!16s%2Fg%2F11j3w77f02?entry=ttu&g_ep=EgoyMDI1MDYyOS4wIKXMDSoASAFQAw%3D%3D" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm break-words">A-604 Blossom Aura, Nadiad, Gujarat, India</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            &copy; 2025 Silver Line. All rights reserved. Made with 💜 for jewelry lovers
          </p>
        </div>
      </div>
    </footer>
  )
}
