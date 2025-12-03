"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { createReturnSchema, ReturnReasonEnum, ReturnResolutionEnum, MAX_RETURN_IMAGES } from "@/lib/validation/returns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/ui/image-upload"
import type { UploadedImage } from "@/hooks/useImageUpload"

type FormValues = z.infer<typeof createReturnSchema>

export default function StartReturnPage() {
  const { toast } = useToast()
  const form = useForm<FormValues>({
    resolver: zodResolver(createReturnSchema),
    defaultValues: {
      orderNumber: "",
      contactEmail: "",
      contactPhone: "",
      reason: "Wrong product delivered",
      details: "",
      resolutionType: "Refund",
    },
  })

  const [images, setImages] = useState<UploadedImage[]>([])
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true)
      const fd = new FormData()
      fd.set("orderNumber", values.orderNumber)
      if (values.contactEmail) fd.set("contactEmail", values.contactEmail)
      if (values.contactPhone) fd.set("contactPhone", values.contactPhone)
      fd.set("reason", values.reason)
      if (values.details) fd.set("details", values.details)
      fd.set("resolutionType", values.resolutionType)

      // Attach up to MAX_RETURN_IMAGES photos
      let count = 0
      for (const img of images) {
        if (img.file) {
          fd.append("photos", img.file)
          count++
          if (count >= MAX_RETURN_IMAGES) break
        }
      }

      const res = await fetch("/api/returns/create", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to submit return")

      toast({ title: "Submitted", description: "Return request created successfully." })
      form.reset()
      setImages([])
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Please try again", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Start a Return</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="orderNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., ORD-..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (or Phone)</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+91-..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ReturnReasonEnum.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details (optional)</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="Add any additional information" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resolutionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resolution</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select resolution" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ReturnResolutionEnum.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Photos */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Upload Photos (up to {MAX_RETURN_IMAGES})</div>
                <ImageUpload value={images} onChange={setImages} maxImages={MAX_RETURN_IMAGES} />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Return"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { form.reset(); setImages([]) }}>
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
