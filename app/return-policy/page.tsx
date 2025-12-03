import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-static"

export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Return & Refund Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-6 text-muted-foreground">
          <section>
            <p>
              We want you to love your purchase. If something isn’t right, you can
              request a return within <Badge className="mx-1">7 days</Badge> of delivery.
              Returns are subject to the conditions below and quality inspection.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Eligibility</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>Initiate the return within 7 calendar days from delivery.</li>
              <li>Items must be unused, unworn, and in original condition.</li>
              <li>Include all original tags, certificates, packaging, and freebies.</li>
              <li>Provide clear photos showing the issue (if applicable).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Non-returnable Items</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>Customized or engraved products.</li>
              <li>Items marked as final sale or clearance.</li>
              <li>Products damaged due to improper use, wear, or negligence.</li>
              <li>Missing original packaging, tags, or certificates.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Refund Methods</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <span className="font-medium">Refund:</span> Credited to the original payment method.
              </li>
              <li>
                <span className="font-medium">Exchange:</span> We’ll arrange a replacement of similar value.
              </li>
              <li>
                <span className="font-medium">Store Credit:</span> One-time coupon usable on a future order.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">How to Start a Return</h2>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Go to the Start a Return page.</li>
              <li>Enter your Order ID and contact email/phone.</li>
              <li>Select a reason and add supporting photos (3–4 images).</li>
              <li>Choose Refund, Exchange, or Store Credit.</li>
              <li>Submit the request. You’ll receive a confirmation.</li>
            </ol>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Processing Timeline</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>Approval within 1–3 business days after review.</li>
              <li>Pickup arranged for eligible returns (if applicable).</li>
              <li>Refunds typically reflect within 5–7 business days after approval.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Contact</h2>
            <p>
              Need help? Email us at <a className="underline" href="mailto:support@elegantjewelry.com">support@elegantjewelry.com</a>
              {" "}or WhatsApp/Call +91-99999-99999.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
