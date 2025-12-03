import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Ban, FileX, Clock, AlertCircle, ShieldCheck, Undo2, Mail } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cancellation Policy | Silver Line",
  description: "Silver Line Cancellation Policy: cancellation window, eligibility rules, non-cancellable items, how to request, refund timelines, exceptions and support contact information.",
}

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-slide-up">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 light-shadow">
            <Ban className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4">Cancellation Policy</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Guidelines for cancelling orders placed on Silver Line, including timelines, exclusions, process steps and refund handling.</p>
          <p className="text-sm text-gray-500 mt-4">Last Updated: November 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* 1. Overview */}
          <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-2xl p-8 shadow-md animate-fade-in">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">1. Purpose & Scope</h2>
                <p className="text-gray-700 leading-relaxed">This Cancellation Policy explains when and how customers may request cancellation of an order placed on Silver Line. Orders are processed quickly for dispatch; therefore, adherence to stated time windows is essential. Successful payment processing (via Razorpay or other approved gateways) precedes order confirmation and stock allocation.</p>
              </div>
            </div>
          </div>

          {/* 2. Cancellation Window */}
          <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-2xl p-8 shadow-md animate-fade-in">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">2. Standard Cancellation Window</h2>
                <ul className="space-y-2 text-gray-700">
                  <li><span className="font-semibold">Immediate Phase:</span> Orders may be cancelled within <span className="font-semibold">1 hour</span> of successful payment if not yet moved to processing.</li>
                  <li><span className="font-semibold">Processing Stage:</span> Once quality check or packaging begins, cancellation eligibility narrows; contact support urgently.</li>
                  <li><span className="font-semibold">Shipped Orders:</span> Dispatch / pickup scan marks the order as non-cancellable. Use Return/Refund process post delivery instead.</li>
                  <li><span className="font-semibold">Force Exceptions:</span> For evident errors (duplicate charges, incorrect amount billed) we attempt best-effort intervention.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Non-Cancellable Items */}
          <div className="bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 rounded-2xl p-8 shadow-md animate-fade-in">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                <FileX className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">3. Non-Cancellable Categories</h2>
                <ul className="space-y-2 text-gray-700">
                  <li>Customized or engraved jewelry.</li>
                  <li>Limited edition / pre-order items already committed to production.</li>
                  <li>Items bundled with promotional free gifts (unless all are returned later under returns policy).</li>
                  <li>Orders flagged for potential fraud until verification is complete.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 4. How to Request Cancellation */}
          <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-2xl p-8 shadow-md animate-fade-in">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                <Undo2 className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">4. Cancellation Request Procedure</h2>
                <ul className="space-y-2 text-gray-700">
                  <li>Email us at <span className="font-semibold">silver.line9250@gmail.com</span> with subject: <span className="italic">Cancellation Request - [Order Number]</span>.</li>
                  <li>Provide order number, registered email, reason for cancellation and (if applicable) duplicate or correction notes.</li>
                  <li>We acknowledge within 24 business hours and confirm acceptance / ineligibility based on current order status.</li>
                  <li>Approved cancellations trigger stock re-allocation and refund initiation workflow.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 5. Refund Timelines After Cancellation */}
          <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-2xl p-8 shadow-md animate-fade-in">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">5. Refund Handling & Timelines</h2>
                <ul className="space-y-2 text-gray-700">
                  <li><span className="font-semibold">Payment Gateway:</span> Refunds are processed through the original payment method (Razorpay / Card / UPI / Wallet).</li>
                  <li><span className="font-semibold">Initiation:</span> Approved cancellation → refund initiated within 2–4 business days.</li>
                  <li><span className="font-semibold">Settlement:</span> Banks or card networks may take 5–10 business days to reflect credit.</li>
                  <li><span className="font-semibold">Partial Cancellation:</span> If only part of an order is cancelled (where allowed), proportional refund issued.</li>
                  <li><span className="font-semibold">Communication:</span> Email confirmation includes refund reference/ARN or transaction ID where available.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 6. Exceptions & Special Cases */}
          <div className="bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 rounded-2xl p-8 shadow-md animate-fade-in">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">6. Exceptions & Escalations</h2>
                <ul className="space-y-2 text-gray-700">
                  <li>Orders already shipped / manifested cannot be cancelled — use Returns module if eligible.</li>
                  <li>High-risk flagged orders (fraud screening) may be auto-cancelled; payment reversals follow gateway norms.</li>
                  <li>Gateway processing anomalies (double charge) are prioritized; supporting screenshots expedite resolution.</li>
                  <li>Regulatory or compliance holds may extend resolution times; we keep you informed.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 7. Contact */}
          <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-2xl p-8 shadow-md animate-fade-in">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">7. Contact & Support</h2>
                <p className="text-gray-700">For urgent cancellation requests within the allowed window or refund clarifications:</p>
                <div className="space-y-2 text-gray-700">
                  <p>Email: <span className="font-semibold">silver.line9250@gmail.com</span></p>
                  <p>Phone: <span className="font-semibold">+91 9512765399</span></p>
                  <p>Address: <span className="font-semibold">A-604 Blossom Aura, Nadiad, Gujarat, India</span></p>
                </div>
                <p className="text-gray-600 text-sm">Include order number and registered contact details for faster lookup.</p>
              </div>
            </div>
          </div>

          {/* 8. Policy Changes */}
          <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-2xl p-8 shadow-md animate-fade-in">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">8. Changes to This Policy</h2>
                <p className="text-gray-700 leading-relaxed">We reserve the right to modify this Cancellation Policy to reflect operational updates, regulatory changes or gateway compliance mandates. Revisions become effective upon posting. Continued use of the website following updates signifies acceptance.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
