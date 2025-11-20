import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Shield, Lock, Eye, Database, Cookie, UserCheck, Globe, Settings, Mail, Phone } from "lucide-react"

export default function PrivacyPage() { 
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-slide-up">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 light-shadow">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">Privacy Policy</h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Your privacy is important to us. Learn how we protect and handle your information
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">Last Updated: January 2025</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-10 sm:py-16 bg-white/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 sm:space-y-8">

            {/* Introduction Card */}
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-md animate-fade-in">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">1. Introduction</h2>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    At Silver Line, we are committed to protecting your privacy. This Privacy Policy explains how we collect, 
                    use, disclose, and safeguard your information when you visit our website and make purchases.
                  </p>
                </div>
              </div>
            </div>

            {/* Information We Collect Card */}
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-md animate-fade-in">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Database className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">2. Information We Collect</h2>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                    We collect information that you provide directly to us when you:
                  </p>
                  <ul className="space-y-2 text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Create an account or make a purchase</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Subscribe to our newsletter</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Contact us with inquiries</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Participate in surveys or promotions</span>
                    </li>
                  </ul>

                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-white/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2">Personal Information:</h3>
                      <ul className="space-y-1 text-xs sm:text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-pink-500 mt-0.5">→</span>
                          <span>Name and contact information</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-pink-500 mt-0.5">→</span>
                          <span>Billing and shipping address</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-pink-500 mt-0.5">→</span>
                          <span>Payment information</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-pink-500 mt-0.5">→</span>
                          <span>Order history and preferences</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2">Automatically Collected:</h3>
                      <ul className="space-y-1 text-xs sm:text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">→</span>
                          <span>IP address and browser type</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">→</span>
                          <span>Device information</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">→</span>
                          <span>Pages visited and time spent</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">→</span>
                          <span>Referring website addresses</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How We Use Card */}
            <div className="bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-md animate-fade-in">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">3. How We Use Your Information</h2>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-pink-500 mt-1">•</span>
                      <span>Process and fulfill your orders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-500 mt-1">•</span>
                      <span>Communicate with you about your orders and account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-500 mt-1">•</span>
                      <span>Send you promotional materials (with your consent)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-500 mt-1">•</span>
                      <span>Improve our website and customer service</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-500 mt-1">•</span>
                      <span>Prevent fraud and enhance security</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-500 mt-1">•</span>
                      <span>Comply with legal obligations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Information Sharing Card */}
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-md animate-fade-in">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">4. Information Sharing and Disclosure</h2>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                    We do not sell, trade, or rent your personal information to third parties. We may share your information with:
                  </p>
                  <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span><strong>Service Providers:</strong> Payment processors, shipping companies, and other service providers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span><strong>Legal Requirements:</strong> When required by law or to protect our rights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Data Security Card */}
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-md animate-fade-in">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">5. Data Security</h2>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                    We implement appropriate technical and organizational measures to protect your personal information. 
                    However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                  </p>
                  <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>SSL encryption for data transmission</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Secure payment processing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Regular security assessments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Restricted access to personal information</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Cookies Card */}
            <div className="bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-md animate-fade-in">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">6. Cookies and Tracking Technologies</h2>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, 
                    and personalize content. You can control cookies through your browser settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Your Rights Card */}
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-md animate-fade-in">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">7. Your Rights</h2>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                    You have the right to:
                  </p>
                  <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Access, update, or delete your personal information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Opt-out of marketing communications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Request a copy of your data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Object to processing of your personal information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Withdraw consent at any time</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Children's Privacy Card */}
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-md animate-fade-in">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">8. Children's Privacy</h2>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Our website is not intended for children under 18 years of age. We do not knowingly collect personal 
                    information from children.
                  </p>
                </div>
              </div>
            </div>

            {/* Third-Party Links Card */}
            <div className="bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-md animate-fade-in">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">9. Third-Party Links</h2>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Our website may contain links to third-party websites. We are not responsible for the privacy practices 
                    of these external sites.
                  </p>
                </div>
              </div>
            </div>

            {/* Changes to Policy Card */}
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-md animate-fade-in">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">10. Changes to Privacy Policy</h2>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    We may update this Privacy Policy from time to time. The updated version will be indicated by an updated 
                    "Last Updated" date and will be effective as soon as it is accessible.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-md animate-fade-in">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">11. Contact Us</h2>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                    If you have any questions or concerns about this Privacy Policy, please contact us:
                  </p>
                  <div className="space-y-2 text-sm sm:text-base text-gray-700">
                    <p className="flex items-start sm:items-center gap-2">
                      <span className="text-purple-500 text-base sm:text-lg">📧</span>
                      <a href="mailto:silver.line9250@gmail.com" className="cursor-pointer hover:text-purple-600 break-words transition-colors">Email: silver.line9250@gmail.com</a>
                    </p>
                    <p className="flex items-start sm:items-center gap-2">
                      <span className="text-purple-500 text-base sm:text-lg">📱</span>
                      <a href="tel:+919512765399" className="cursor-pointer hover:text-purple-600 transition-colors">Phone: +91 9512765399</a>
                    </p>
                    <p className="flex items-start sm:items-center gap-2">
                      <span className="text-purple-500 text-base sm:text-lg">📍</span>
                      <a href="https://www.google.com/maps/place/Blossom+Aura/@22.6774876,72.8793417,17z/data=!3m1!4b1!4m6!3m5!1s0x395e5b3c654679bd:0x7fec0936b8b30f97!8m2!3d22.6774876!4d72.8819166!16s%2Fg%2F11j3w77f02?entry=ttu&g_ep=EgoyMDI1MDYyOS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-purple-600 break-words transition-colors">Address: A-604 Blossom Aura, Nadiad, Gujarat, India</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
