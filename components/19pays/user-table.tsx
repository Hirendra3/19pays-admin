"use client"

import { useMemo } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Eye, MapPin, Mail, Phone, Shield, Crown } from "lucide-react"

type User = {
  _id?: string
  name?: string
  full_name?: string
  email?: string
  unique_id?: string
  unique_user_id?: string
  id?: string
  mobile?: number
  isVerified?: boolean
  isVerifiedmobile?: boolean
  IsAdimin?: boolean
  location?: {
    country?: string
    region?: string
    city?: string
    latitude?: number
    longitude?: number
  }
  ipAddress?: string
  createdAt?: string
  updatedAt?: string
  __v?: number
  [k: string]: any
}

async function fetchUsers(): Promise<User[]> {
  const token = localStorage.getItem("admin_token")
  if (!token) throw new Error("No session")
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({}),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(t || "Failed to load users")
  }
  const data = await res.json()
  // Attempt common shapes: { users: [] } or { data: [] } or []
  const list = data?.users || data?.data || data?.result || data
  return Array.isArray(list) ? list : []
}

export function UsersTable({ search }: { search?: string }) {
  const { data, error, isLoading, mutate } = useSWR("users", fetchUsers)
  const router = useRouter()

  const filtered = useMemo(() => {
    if (!data) return []
    if (!search) return data
    const q = search.toLowerCase()
    return data.filter((u) =>
      [u.name, u.full_name, u.email, u.unique_id, u.unique_user_id, u.id, u._id, u.mobile]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    )
  }, [data, search])

  return (
    <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl shadow-xl">
      <CardHeader className="flex-row items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-white">
            <Eye className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            Users
          </CardTitle>
        </div>
        <Button 
          variant="outline" 
          onClick={() => mutate()}
          className="bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner className="h-8 w-8 mx-auto mb-4" />
              <p className="text-gray-600">Loading users…</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-red-600">{error.message ?? "Failed to load users"}</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-4">
              {filtered.map((u, idx) => {
                const name = u.name || u.full_name || "-"
                const email = u.email || "-"
                const uid = u.unique_id || u.unique_user_id || u.id || u._id || "-"
                const mobile = u.mobile || "-"
                const isAdmin = u.IsAdimin || false
                const isVerified = u.isVerified || false
                const isVerifiedMobile = u.isVerifiedmobile || false
                const location = u.location ? `${u.location.city || ""}, ${u.location.country || ""}`.replace(/^,\s*|,\s*$/g, "") : "-"
                
                return (
                  <div key={`${uid}-${idx}`} className="backdrop-blur-sm bg-white/50 border border-white/30 rounded-xl p-4 hover:bg-white/70 transition-all duration-300">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{name}</h3>
                        <div className="flex gap-1">
                          {isAdmin && (
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                              <Crown className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                          {isVerified && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{mobile}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{location}</span>
                        </div>
                        <div className="flex gap-1 pt-2">
                          {isVerified && (
                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                              Email ✓
                            </Badge>
                          )}
                          {isVerifiedMobile && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                              Mobile ✓
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                          onClick={() => router.push(`/user-profile/${uid}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <div className="p-6 rounded-lg bg-white/50 border border-white/30">
                    <p className="text-gray-500">No users found.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <Table className="hidden sm:table bg-white/50 rounded-lg">
              <TableHeader>
                <TableRow className="border-white/30">
                  <TableHead className="text-gray-700 font-semibold">Name</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Email</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Mobile</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Location</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Unique ID</TableHead>
                  <TableHead className="text-right text-gray-700 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u, idx) => {
                  const name = u.name || u.full_name || "-"
                  const email = u.email || "-"
                  const mobile = u.mobile || "-"
                  const uid = u.unique_id || u.unique_user_id || u.id || u._id || "-"
                  const isAdmin = u.IsAdimin || false
                  const isVerified = u.isVerified || false
                  const isVerifiedMobile = u.isVerifiedmobile || false
                  const location = u.location ? `${u.location.city || ""}, ${u.location.country || ""}`.replace(/^,\s*|,\s*$/g, "") : "-"
                  
                  return (
                    <TableRow key={`${uid}-${idx}`} className="border-white/30 hover:bg-white/30 transition-colors">
                      <TableCell className="font-semibold text-gray-900">{name}</TableCell>
                      <TableCell className="text-gray-600">{email}</TableCell>
                      <TableCell className="text-gray-600">{mobile}</TableCell>
                      <TableCell className="max-w-[150px] truncate text-gray-600">{location}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {isAdmin && (
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 transition-colors">
                              <Crown className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                          {isVerified && (
                            <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 transition-colors">
                              <Shield className="h-3 w-3 mr-1" />
                              ✓
                            </Badge>
                          )}
                          {isVerifiedMobile && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 transition-colors">
                              📱
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate text-gray-600">{uid}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => router.push(`/user-profile/${uid}`)}
                          className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="p-6 rounded-lg bg-white/50 border border-white/30">
                        <p className="text-gray-500">No users found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </div>
  )
}