"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft, User, MapPin, CreditCard, FileText, AlertCircle, Download, Eye, ExternalLink, CheckCircle, XCircle, Clock, Shield, Mail, Phone, Calendar, Building, Globe, ChevronRight } from "lucide-react"
import { useUserProfile } from "@/hooks/use-user-profile"
import { useAuthToken, authenticatedFetch } from "@/hooks/use-auth"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import DebtRequests from "./debt-requests"

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg bg-white/50 border border-white/30 p-4 gap-2 sm:gap-0 hover:bg-white/70 transition-all duration-300">
      <span className="text-sm text-gray-600 font-medium">{label}</span>
      <span className="text-sm font-semibold text-gray-900 break-all sm:break-normal text-right sm:text-left">{value}</span>
    </div>
  )
}

function AadhaarViewer({ adharpath, watermark }: { adharpath: string; watermark: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let aborted = false
    
    async function loadAadhaar() {
      try {
        setLoading(true)
        setError(null)
        
        console.log('Loading Aadhaar:', adharpath)
        const response = await authenticatedFetch(`/api/aadhaar/${encodeURI(adharpath)}`)
        console.log('Aadhaar response:', response.status, response.headers.get('content-type'))
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Aadhaar fetch error:', errorText)
          throw new Error(`Failed to fetch Aadhaar file: ${response.status}`)
        }
        
        const contentType = response.headers.get("content-type") || ""
        const blob = await response.blob()
        console.log('Aadhaar blob size:', blob.size, 'type:', contentType)
        
        if (aborted) return
        
        // Create blob URL for both PDFs and images
        const blobUrl = URL.createObjectURL(blob)
        console.log('Created blob URL:', blobUrl)
        setImageUrl(blobUrl)
        setLoading(false)
      } catch (e: any) {
        console.error('Aadhaar loading error:', e)
        if (!aborted) {
          setError(e.message || "Failed to load Aadhaar document")
        }
      } finally {
        if (!aborted) {
          setLoading(false)
        }
      }
    }
    
    loadAadhaar()
    return () => {
      aborted = true
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [adharpath])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    
    const block = (e: Event) => e.preventDefault()
    el.addEventListener("contextmenu", block)
    el.addEventListener("dragstart", block)
    
    return () => {
      el.removeEventListener("contextmenu", block)
      el.removeEventListener("dragstart", block)
    }
  }, [])

  if (loading) {
    return (
      <div className="grid gap-2 select-none">
        <span className="text-sm text-muted-foreground font-medium">Aadhaar Document</span>
        <div className="rounded-md border p-8 bg-muted/20 flex items-center justify-center">
          <Spinner className="h-6 w-6" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-2 select-none">
        <span className="text-sm text-muted-foreground font-medium">Aadhaar Document</span>
        <div className="rounded-md border p-4 bg-muted/20">
          <p className="text-sm text-destructive">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="grid gap-2 select-none">
      <span className="text-sm text-muted-foreground font-medium">Aadhaar Document</span>
      <div className="rounded-md border p-2 bg-muted/20">
        {imageUrl && (
          <div className="space-y-2">
            {/* Try to display as image first */}
            <img
              src={imageUrl}
              alt="Aadhaar Document"
              className="w-full h-auto rounded-md object-contain"
              style={{ 
                filter: 'blur(0.5px)',
                maxHeight: '800px',
                minHeight: '400px'
              }}
              onError={(e) => {
                // If image fails to load, try as PDF in iframe
                const target = e.target as HTMLImageElement
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `
                    <iframe
                      src="${imageUrl}"
                      className="w-full rounded-md"
                      style="height: 600px; min-height: 400px;"
                      title="Aadhaar Document"
                    ></iframe>
                  `
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Document ID: {watermark} | Viewing only. Download/print is disabled.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

async function downloadAadhaar(adharpath: string, watermark: string) {
  try {
    const response = await authenticatedFetch(`/api/aadhaar/${encodeURI(adharpath)}`)
    if (!response.ok) throw new Error('Failed to fetch Aadhaar document')
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // Determine file extension based on content type
    const contentType = response.headers.get('content-type') || ''
    const extension = contentType.includes('pdf') ? 'pdf' : 'jpg'
    
    link.download = `aadhaar_${watermark}_${Date.now()}.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading Aadhaar:', error)
    alert('Failed to download Aadhaar document')
  }
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const uniqueId = params.uniqueId as string
  const token = useAuthToken()
  const isAdmin = !!token
  
  const { profile, isLoading, error, refresh } = useUserProfile(uniqueId)

  // If not logged in, show a friendly prompt instead of raw errors
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-8 shadow-xl text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view user profiles.</p>
          <Button onClick={() => router.push('/login')} className="bg-indigo-600 hover:bg-indigo-700">
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-8 shadow-xl text-center">
          <Spinner className="h-8 w-8 mx-auto mb-4" />
          <p className="text-gray-600">Loading user profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-8 shadow-xl text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">
            {String(error).includes("Authorization token required") 
              ? "Your session has expired. Please log in again."
              : "Failed to load user profile. Please try again."
            }
          </p>
          <Button onClick={() => router.back()} variant="outline" className="mr-4">
            Go Back
          </Button>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse delay-1000" />
      
      <div className="relative z-10">
        

        {/* Breadcrumb */}
        <div className="pt-20 pb-8 px-6">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <span className="hover:text-foreground transition-colors cursor-pointer">Dashboard</span>
            <ChevronRight className="h-4 w-4" />
            <span className="hover:text-foreground transition-colors cursor-pointer">Users</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Profile</span>
          </nav>
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              User Profile
            </h1>
            <p className="text-muted-foreground text-lg">
            {profile?.Userresult?.name || "Unknown User"}
          </p>
        </div>
      </div>

        {/* Profile Header */}
        {profile?.Userresult && (
          <div className="px-6 mb-8">
            <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-8 shadow-xl animate-fade-up">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {profile.Userresult.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  {profile.Userresult.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <Shield className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                
                {/* User Info */}
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {profile.Userresult.name || "Unknown User"}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {profile.Userresult.email || "No email"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {profile.Userresult.mobile || "No mobile"}
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2">
                      {profile.Userresult.isVerified && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 transition-colors">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge variant="outline" className="border-indigo-200 text-indigo-700">
                        ID: {profile.Userresult.unique_id || "N/A"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="px-6 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
          {/* User Information */}
              {profile?.Userresult && (
                <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-white">
                      <User className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                      User Information
                    </h3>
                  </div>
                  <div className="space-y-4">
                <InfoRow label="Name" value={profile.Userresult.name || "-"} />
                <InfoRow label="Email" value={profile.Userresult.email || "-"} />
                <InfoRow label="Mobile" value={profile.Userresult.mobile || "-"} />
                <InfoRow label="Unique ID" value={profile.Userresult.unique_id || "-"} />
                  </div>
                </div>
          )}
          
          {/* Account Status */}
              {profile?.Userresult && (
                <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                      <Shield className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Account Status
                    </h3>
                  </div>
                  <div className="space-y-4">
                <InfoRow 
                  label="Email Verified" 
                  value={
                        <Badge className={`${
                      profile.Userresult.isVerified 
                            ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                        } transition-colors`}>
                      {profile.Userresult.isVerified ? 'Verified' : 'Not Verified'}
                        </Badge>
                  } 
                />
                <InfoRow 
                  label="Mobile Verified" 
                  value={
                        <Badge className={`${
                      profile.Userresult.isVerifiedmobile 
                            ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                        } transition-colors`}>
                      {profile.Userresult.isVerifiedmobile ? 'Verified' : 'Not Verified'}
                        </Badge>
                  } 
                />
                <InfoRow 
                  label="Admin Status" 
                  value={
                        <Badge className={`${
                      profile.Userresult.IsAdimin 
                            ? 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200' 
                            : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                        } transition-colors`}>
                      {profile.Userresult.IsAdimin ? 'Admin' : 'User'}
                        </Badge>
                  } 
                />
                  </div>
                </div>
          )}

          {/* Location Information */}
              {profile?.Userresult?.location && (
                <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Location
                      </h3>
                    </div>
                    {profile.Userresult.location.latitude && profile.Userresult.location.longitude && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const url = `https://www.google.com/maps?q=${profile.Userresult.location.latitude},${profile.Userresult.location.longitude}`
                          window.open(url, '_blank')
                        }}
                        className="flex items-center gap-2 bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Location
                      </Button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <InfoRow label="IP Address" value={profile.Userresult.ipAddress || "-"} />
                <InfoRow label="City" value={profile.Userresult.location.city || "-"} />
                <InfoRow label="Region" value={profile.Userresult.location.region || "-"} />
                <InfoRow label="Country" value={profile.Userresult.location.country || "-"} />
                {profile.Userresult.location.latitude && profile.Userresult.location.longitude && (
                  <InfoRow 
                    label="Coordinates" 
                    value={`${profile.Userresult.location.latitude}, ${profile.Userresult.location.longitude}`} 
                  />
                )}
                  </div>
                </div>
          )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
          {/* KYC Information */}
              {profile?.kycdataresult && (
                <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 text-white">
                      <FileText className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      KYC Information
                    </h3>
                  </div>
                  <div className="space-y-4">
                <InfoRow 
                  label="KYC Status" 
                  value={
                        <Badge className={`${
                      profile.kycdataresult.status === 'verified'
                            ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'
                        } transition-colors`}>
                      {profile.kycdataresult.status || 'Not Verified'}
                        </Badge>
                  } 
                />
                <InfoRow label="KYC Type" value={profile.kycdataresult.kyc_type || "-"} />
                <InfoRow label="Aadhaar Linked" value={profile.kycdataresult.aadhaar_linked ? "Yes" : "No"} />
                <InfoRow label="Completed" value={profile.kycdataresult.completed ? "Yes" : "No"} />
                <InfoRow label="Transaction ID" value={profile.kycdataresult.transaction_id || "-"} />
                <InfoRow 
                  label="Created" 
                  value={profile.kycdataresult.createdAt ? new Date(profile.kycdataresult.createdAt).toLocaleDateString() : "-"} 
                />
                    {profile.kycdataresult.adharpath && isAdmin && (
                      <div className="mt-6 p-4 rounded-lg bg-white/50 border border-white/30">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-medium text-gray-700">Aadhaar Document</h4>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                                <DialogHeader>
                                  <DialogTitle>Aadhaar Document</DialogTitle>
                                </DialogHeader>
                                <AadhaarViewer adharpath={profile.kycdataresult.adharpath} watermark={profile.Userresult?.unique_id || "19Pays"} />
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => downloadAadhaar(profile.kycdataresult.adharpath, profile.Userresult?.unique_id || "19Pays")}
                              className="bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          Admin access required to view and download Aadhaar documents.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
          )}

          {/* Bank Account Information */}
              {profile?.BankAccountresult && (
                <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Bank Account Information
                    </h3>
                  </div>
                  <div className="space-y-4">
                <InfoRow 
                  label="Account Status" 
                  value={
                        <Badge className={`${
                      profile.BankAccountresult.status === 'success'
                            ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                        } transition-colors`}>
                      {profile.BankAccountresult.status || 'Unknown'}
                        </Badge>
                  } 
                />
                <InfoRow label="Account Holder" value={profile.BankAccountresult.full_name || "-"} />
                <InfoRow label="Account Number" value={profile.BankAccountresult.id_number || "-"} />
                <InfoRow label="IFSC Code" value={profile.BankAccountresult.ifsc || "-"} />
                {profile.BankAccountresult.ifsc_details && (
                  <>
                    <InfoRow label="Bank Name" value={profile.BankAccountresult.ifsc_details.bank_name || "-"} />
                    <InfoRow label="Branch" value={profile.BankAccountresult.ifsc_details.branch || "-"} />
                    <InfoRow label="City" value={profile.BankAccountresult.ifsc_details.city || "-"} />
                    <InfoRow label="State" value={profile.BankAccountresult.ifsc_details.state || "-"} />
                    <InfoRow 
                      label="UPI Enabled" 
                      value={
                            <Badge className={`${
                          profile.BankAccountresult.ifsc_details.upi
                                ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                            } transition-colors`}>
                          {profile.BankAccountresult.ifsc_details.upi ? 'Yes' : 'No'}
                            </Badge>
                      } 
                    />
                  </>
                )}
                <InfoRow 
                  label="Created" 
                  value={profile.BankAccountresult.createdAt ? new Date(profile.BankAccountresult.createdAt).toLocaleDateString() : "-"} 
                />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Debt Requests Component */}
          <DebtRequests profile={profile} token={token} uniqueId={uniqueId} refresh={refresh} />

          {/* Account Details */}
          {profile?.Userresult && (
            <div className="mt-8">
              <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Account Details
                  </h3>
                </div>
                <div className="space-y-4">
                <InfoRow 
                  label="Created" 
                  value={profile.Userresult.createdAt ? new Date(profile.Userresult.createdAt).toLocaleDateString() : "-"} 
                />
                <InfoRow 
                  label="Last Updated" 
                  value={profile.Userresult.updatedAt ? new Date(profile.Userresult.updatedAt).toLocaleDateString() : "-"} 
                />
                {profile.Userresult.otpExpiry && (
                  <InfoRow 
                    label="OTP Expiry" 
                    value={new Date(profile.Userresult.otpExpiry).toLocaleDateString()} 
                  />
                )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
