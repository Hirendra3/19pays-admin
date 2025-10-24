"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react"
import { authenticatedFetch } from "@/hooks/use-auth"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface DebtRequestsProps {
  profile: any;
  token: string | null;
  uniqueId: string;
  refresh: () => void;
}

export default function DebtRequests({ profile, token, uniqueId, refresh }: DebtRequestsProps) {
  const [debtUpdating, setDebtUpdating] = useState<{ [key: string]: boolean }>({})
  const [adjustedAmounts, setAdjustedAmounts] = useState<{ [key: string]: string }>({})

  // Unified function to handle all debt updates
  async function handleDebtUpdate(
    debtId: string, 
    action: 'approve' | 'reject' | 'markPaid',
    currentStatus?: string
  ) {
    if (!token) {
      toast({ 
        title: "Not allowed", 
        description: "Admin authorization required", 
        variant: "destructive" 
      })
      return
    }

    // Handle confirmations based on action
    if (action === 'approve' && currentStatus === 'approved') {
      toast({
        title: "Already Approved",
        description: "This request is already approved. You can reject it if you want to change the status.",
        variant: "default"
      })
      return
    }
    
    if (action === 'reject' && currentStatus === 'rejected') {
      toast({
        title: "Already Rejected",
        description: "This request is already rejected. You can approve it if you want to change the status.",
        variant: "default"
      })
      return
    }

    if (action === 'approve' && currentStatus === 'rejected') {
      if (!confirm("Are you sure you want to approve this previously rejected request?")) {
        return
      }
    }

    if (action === 'reject' && currentStatus === 'approved') {
      if (!confirm("Are you sure you want to reject this approved request?")) {
        return
      }
    }

    if (action === 'markPaid') {
      const adjustedAmount = Number(adjustedAmounts[debtId])
      if (!Number.isFinite(adjustedAmount) || adjustedAmount < 0) {
        toast({ 
          title: "Invalid amount", 
          description: "Please enter a valid positive number for adjusted amount", 
          variant: "destructive" 
        })
        return
      }
      
      if (!confirm(`Are you sure you want to mark this debt as paid with adjusted amount ₹${adjustedAmount}? This action cannot be undone.`)) {
        return
      }
    }

    setDebtUpdating(prev => ({ ...prev, [debtId]: true }))

    try {
      // Build request body based on action
      const body: any = {
        unique_user_id: uniqueId,
        debtid: debtId,
      }

      switch (action) {
        case 'approve':
          body.approved = 'approved'
          body.adjustedAmount = 0
          break
        case 'reject':
          body.approved = 'rejected'
          body.adjustedAmount = 0
          break
        case 'markPaid':
          body.approved = 'approved'
          body.paid = true
          body.adjustedAmount = Math.floor(Number(adjustedAmounts[debtId]))
          break
      }

      const res = await authenticatedFetch("/api/updateuserdebt", {
        method: "POST",
        body: JSON.stringify(body),
      })

      let data: any = {}
      let text = ""
      try {
        text = await res.text()
        data = text ? JSON.parse(text) : {}
      } catch {
        // non-JSON body
      }

      if (!res.ok) {
        const msg = data?.error || data?.message || text || `Failed to update debt (${res.status})`
        throw new Error(msg)
      }

      // Success messages based on action
      let successMsg = ""
      switch (action) {
        case 'approve':
          successMsg = "Debt approved successfully"
          break
        case 'reject':
          successMsg = "Debt rejected successfully"
          break
        case 'markPaid':
          successMsg = "Debt marked as paid successfully"
          setAdjustedAmounts(prev => ({ ...prev, [debtId]: "" }))
          break
      }

      toast({ 
        title: "Success", 
        description: successMsg,
        variant: "default"
      })
      refresh()

    } catch (e: any) {
      toast({ 
        title: "Update failed", 
        description: e?.message || String(e), 
        variant: "destructive" 
      })
    } finally {
      setDebtUpdating(prev => ({ ...prev, [debtId]: false }))
    }
  }

  if (!profile.Debtresult) return null

  const debts = Array.isArray(profile.Debtresult) ? profile.Debtresult : [profile.Debtresult]

  const getStatusBadge = (debt: any) => {
    const debtStatus = debt.approved || 'pending'
    
    switch (debtStatus) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  const getPaidBadge = (paid: boolean) => {
    return paid ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Yes</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">No</Badge>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <AlertCircle className="h-5 w-5 text-orange-600" />
        <CardTitle className="text-orange-600">Debt Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Adjusted Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Description</TableHead>
              {token && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {debts.map((debt: { approved: string; _id: string; amount: any; adjustedAmount: any; paid: any; createdAt: string | number | Date; description: any }, index: any) => {
              const debtStatus = debt.approved || 'pending'
              const isUpdating = debtUpdating[debt._id] || false
              
              return (
                <TableRow key={debt._id || index}>
                  <TableCell className="font-medium">₹{debt.amount || "0"}</TableCell>
                  <TableCell className="font-medium">₹{debt.adjustedAmount || "0"}</TableCell>
                  <TableCell>{getStatusBadge(debt)}</TableCell>
                  <TableCell>{getPaidBadge(debt.paid)}</TableCell>
                  <TableCell>
                    {debt.createdAt ? new Date(debt.createdAt).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {debt.description || "-"}
                  </TableCell>
                  
                  {token && (
                    <TableCell className="text-right">
                      {!debt.paid ? (
                        <div className="flex flex-col gap-2 items-end">
                          {/* Show Approve/Reject buttons for pending and approved debts */}
                          {(debtStatus === 'pending' || debtStatus === 'approved') && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                disabled={isUpdating} 
                                onClick={() => handleDebtUpdate(debt._id, 'approve', debtStatus)}
                              >
                                {isUpdating ? "..." : "Approve"}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                disabled={isUpdating} 
                                onClick={() => handleDebtUpdate(debt._id, 'reject', debtStatus)}
                              >
                                {isUpdating ? "..." : "Reject"}
                              </Button>
                            </div>
                          )}
                          
                          {/* Show Mark as Paid with adjusted amount input for approved debts */}
                          {debtStatus === 'approved' && (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0"
                                placeholder="Adjusted amount"
                                value={adjustedAmounts[debt._id] || ""}
                                onChange={(e) => setAdjustedAmounts(prev => ({ ...prev, [debt._id]: e.target.value }))}
                                className="w-32"
                              />
                              <Button 
                                size="sm" 
                                variant="outline"
                                disabled={isUpdating || !adjustedAmounts[debt._id]} 
                                onClick={() => handleDebtUpdate(debt._id, 'markPaid', debtStatus)}
                              >
                                {isUpdating ? "..." : "Mark Paid"}
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Paid</span>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        
        {debts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No debt requests found
          </div>
        )}
      </CardContent>
    </Card>
  )
}