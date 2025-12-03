import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Truck, MapPin, Clock, RefreshCcw, ShieldCheck, Package, AlertTriangle, Globe2, Undo2 } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Silver Line",
  description: "Detailed Shipping & Delivery Policy for Silver Line: dispatch timelines, tracking, courier partners, ODA serviceability, delivery attempts, damage handling, delays, international shipping and support information.",
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-slide-up">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 light-shadow">
            <Truck className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4">Shipping & Delivery Policy</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Transparent, reliable and secure delivery of premium silver jewelry across India and select global destinations.</p>
          <p className="text-sm text-gray-500 mt-4">Last Updated: November 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* 1. Overview */}
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-8 shadow-md animate-fade-in">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">1. Policy Overview</h2>
                <p className="text-gray-700 leading-relaxed">This Shipping & Delivery Policy explains how orders placed on Silver Line ("we", "our") are processed, packed, dispatched, tracked and delivered. We follow industry-standard security and packaging norms and integrate trusted logistics partners to ensure safe delivery. All payments are processed securely via approved gateways (including Razorpay) and shipment creation occurs only after payment confirmation.</p>
              </div>
            </div>
          </div>

          {/* 2. Order Processing & Dispatch */}
          <div className="bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 rounded-2xl p-8 shadow-md animate-fade-in">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">2. Order Processing & Dispatch Timelines</h2>
                <ul className="space-y-2 text-gray-700">
                  <li><span className="font-semibold">Payment Confirmation:</span> Orders enter the processing queue only after successful payment authorization & capture.</li>
                  <li><span className="font-semibold">Processing Time:</span> Standard ready-to-ship items dispatch within 24–48 business hours.</li>
                  <li><span className="font-semibold">Made-to-Order / Customized:</span> May require 3–7 business days before dispatch; customers are notified by email/SMS.</li>
                  <li><span className="font-semibold">Quality & Security:</span> Each piece undergoes a final quality, hallmark and packaging integrity check prior to handover.</li>
                  <li><span className="font-semibold">Unexpected Delays:</span> In rare cases (supply constraints, verification), we proactively inform you and offer options to wait, modify or cancel.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Shipping Modes & Charges */}
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 shadow-md animate-fade-in">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">3. Shipping Modes & Charges</h2>
                <p className="text-gray-700">Shipping charges (if applicable) are displayed transparently at checkout before payment.</p>
                <ul className="space-y-2 text-gray-700">
                  <li><span className="font-semibold">Free Shipping:</span> Available on qualifying cart values or promotional campaigns.</li>
                  <li><span className="font-semibold">Standard Shipping:</span> 3–7 business days to metro cities; Tier-2/ODA may extend to 7–10 days.</li>
                  <li><span className="font-semibold">Express Shipping (if offered):</span> 1–3 business days; charged separately and subject to availability & pincode serviceability.</li>
                  <li><span className="font-semibold">COD (Cash on Delivery):</span> May incur an additional fee; subject to order value limits & serviceable areas.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 4. Serviceability & ODA */}
          <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-2xl p-8 shadow-md animate-fade-in">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">4. Serviceability, Remote & ODA Areas</h2>
                <ul className="space-y-2 text-gray-700">
                  <li><span className="font-semibold">Serviceability Check:</span> Customers must ensure correct pincode entry; non-serviceable or ODA (Out of Delivery Area) locations may attract surcharges or extended timelines.</li>
                  <li><span className="font-semibold">ODA Handling:</span> We inform you of any ODA charges before dispatch; you may opt to proceed, change address, or cancel.</li>
                  <li><span className="font-semibold">Address Accuracy:</span> Incorrect address/pincode results in delays or cancellation; reshipment fees may apply.</li>
                  <li><span className="font-semibold">Multiple Attempts:</span> Courier partners attempt up to 2–3 deliveries for COD/Signature-required shipments.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 5. Tracking & Notifications */}
          <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-2xl p-8 shadow-md animate-fade-in">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                <RefreshCcw className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">5. Tracking & Status Updates</h2>
                <ul className="space-y-2 text-gray-700">
                  <li>Tracking number is issued once the shipment is electronically manifested.</li>
                  <li>Live tracking updates available via our <span className="font-semibold">Track</span> section or courier link.</li>
                  <li>Status events include: Manifested, Picked Up, In Transit, Out for Delivery, Delivered, RTO (Return to Origin).</li>
                  <li>Delays due to weather, regulatory checks or network disruptions are communicated proactively when possible.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 6. Courier Partners & Security */}
          <div className="bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 rounded-2xl p-8 shadow-md animate-fade-in">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                <Globe2 className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">6. Courier Partners & Security Measures</h2>
                <p className="text-gray-700">We partner with reputable national and regional logistics providers (e.g., Delhivery, Bluedart, DTDC, or other verified networks). Selection depends on serviceability, speed and reliability.</p>
                <ul className="space-y-2 text-gray-700">
                  <li><span className="font-semibold">Tamper-Proof Packaging:</span> Jewelry packed with protective sealing and cushioning.</li>
                  <li><span className="font-semibold">Insurance & Claims:</span> High-value parcels may be insured; claims must be initiated within 24 hours of marked delivery.</li>
                  <li><span className="font-semibold">Verification:</span> For certain orders we may request ID verification or OTP confirmation on delivery.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 7. Damages, Missing & Discrepancies */}
            <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-2xl p-8 shadow-md animate-fade-in">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">7. Damages, Missing Items & Delivery Discrepancies</h2>
                  <ul className="space-y-2 text-gray-700">
                    <li><span className="font-semibold">Immediate Inspection:</span> Please record unboxing if outer packaging appears tampered.</li>
                    <li><span className="font-semibold">Damage Claims:</span> Email us within 24 hours with clear photos and order number.</li>
                    <li><span className="font-semibold">Missing / Wrong Product:</span> Report within 48 hours; we verify inventory logs & dispatch records.</li>
                    <li><span className="font-semibold">Non-Receipt Dispute:</span> If marked delivered but not received, raise within 24 hours so we can escalate with the courier.</li>
                  </ul>
                </div>
              </div>
            </div>

          {/* 8. Delays & Force Majeure */}
          <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-2xl p-8 shadow-md animate-fade-in">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                <Undo2 className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">8. Delays, Undelivered & Return to Origin (RTO)</h2>
                <ul className="space-y-2 text-gray-700">
                  <li><span className="font-semibold">Attempted Delivery:</span> If attempts fail (address closed / unreachable), shipment may be returned; re-shipping fees can apply.</li>
                  <li><span className="font-semibold">Force Majeure:</span> Natural disasters, strikes, lockdowns or regulatory actions may extend delivery timelines.</li>
                  <li><span className="font-semibold">Customer Unavailability:</span> Prolonged non-response can trigger auto-cancellation or return processing.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 9. International Shipping */}
          <div className="bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 rounded-2xl p-8 shadow-md animate-fade-in">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                <Globe2 className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">9. International Shipments (If Enabled)</h2>
                <ul className="space-y-2 text-gray-700">
                  <li>Customs duties, import charges and local taxes are borne by the recipient.</li>
                  <li>Transit times vary by destination and customs clearance efficiency.</li>
                  <li>Tracking updates may consolidate after leaving India until destination hub scan.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 10. Contact & Support */}
          <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-2xl p-8 shadow-md animate-fade-in">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">10. Contact & Escalations</h2>
                <p className="text-gray-700">For delivery issues, delays or damage claims, please contact us promptly:</p>
                <div className="space-y-2 text-gray-700">
                  <p>Email: <span className="font-semibold">silver.line9250@gmail.com</span></p>
                  <p>Phone: <span className="font-semibold">+91 9512765399</span></p>
                  <p>Address: <span className="font-semibold">A-604 Blossom Aura, Nadiad, Gujarat, India</span></p>
                </div>
                <p className="text-gray-600 text-sm">Raising concerns within stipulated windows enables faster resolution and, where applicable, compensation or replacements.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
