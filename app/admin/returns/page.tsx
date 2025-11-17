"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { ReturnItem } from "@/types/returns"

const statusColor = (s: string) => {
  switch (s) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800"
    case "APPROVED":
      return "bg-green-100 text-green-800"
    case "REJECTED":
      return "bg-red-100 text-red-800"
    case "COMPLETED":
      return "bg-blue-100 text-blue-800"
    default:
      return ""
  }
}

export default function AdminReturnsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<ReturnItem[]>([])
  const [status, setStatus] = useState<string>("all")
  const [selected, setSelected] = useState<ReturnItem | null>(null)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const fetchData = async (st: string) => {
    setLoading(true)
    try {
      const qs = st && st !== "all" ? `?status=${encodeURIComponent(st)}` : ""
      const res = await fetch(`/api/returns${qs}`, { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed fetching returns")
      setItems(data.returns)
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(status)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const onApprove = async (id: number) => {
    try {
      const res = await fetch(`/api/returns/${id}/approve`, { method: "POST", body: JSON.stringify({}) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Approve failed")
      toast({ title: "Approved", description: "Return approved." })
      fetchData(status)
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    }
  }

  const onReject = async () => {
    if (!selected) return
    try {
      const res = await fetch(`/api/returns/${selected.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Reject failed")
      toast({ title: "Rejected", description: "Return rejected." })
      setRejectOpen(false)
      setRejectReason("")
      setSelected(null)
      fetchData(status)
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <CardTitle>Returns</CardTitle>
          <div className="w-44">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Resolution</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>#{r.id}</TableCell>
                    <TableCell className="font-medium">{r.orderNumber}</TableCell>
                    <TableCell>
                      {r.user ? (
                        <div className="text-sm">
                          <div>{r.user.firstName} {r.user.lastName}</div>
                          <div className="text-muted-foreground">{r.user.email}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Guest</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={r.reason}>{r.reason}</TableCell>
                    <TableCell>{r.resolutionType.replace("_", " ")}</TableCell>
                    <TableCell>
                      <Badge className={statusColor(r.status)}>{r.status}</Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelected(r)}>View</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Return #{r.id} — {r.orderNumber}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="text-sm text-muted-foreground">{r.reason}</div>
                            {r.photos?.length ? (
                              <div className="grid grid-cols-3 gap-2">
                                {r.photos.map((p, i) => (
                                  <img key={i} src={p} alt={`photo-${i}`} className="h-24 w-full object-cover rounded" />
                                ))}
                              </div>
                            ) : null}
                            {r.rejectionReason && (
                              <div className="text-sm"><span className="font-medium">Rejection reason:</span> {r.rejectionReason}</div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button variant="ghost">Close</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {r.status === "PENDING" && (
                        <>
                          <Button size="sm" onClick={() => onApprove(r.id)}>Approve</Button>
                          <Dialog open={rejectOpen && selected?.id === r.id} onOpenChange={(o) => { setRejectOpen(o); if (!o) setSelected(null) }}>
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="sm" onClick={() => { setSelected(r); setRejectOpen(true) }}>Reject</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Return #{r.id}</DialogTitle>
                              </DialogHeader>
                              <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Provide rejection reason" />
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
                                <Button variant="destructive" onClick={onReject}>Reject</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {!items.length && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      {loading ? "Loading..." : "No return requests found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
