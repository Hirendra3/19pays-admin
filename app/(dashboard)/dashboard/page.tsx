"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, Crown, Activity, CheckCircle, TrendingUp, BarChart3, Clock, Mail, Smartphone } from "lucide-react"

interface User {
  _id: string
  email: string
  mobile: string
  isAdmin: boolean
  isVerified: boolean
  emailVerified: boolean
  mobileVerified: boolean
  createdAt: string
  [key: string]: any
}

interface DashboardStats {
  totalUsers: number
  verifiedUsers: number
  adminUsers: number
  emailVerifiedUsers: number
  mobileVerifiedUsers: number
  recentUsers: number
}

async function fetchDashboardStats(): Promise<DashboardStats | null> {
  const token = localStorage.getItem("admin_token")
  if (!token) return null
  
  try {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  })
    
  if (!res.ok) return null
    
  const data = await res.json()
    const users: User[] = data?.users || data?.data || data?.result || data
    
    if (!Array.isArray(users)) return null
    
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const stats: DashboardStats = {
      totalUsers: users.length,
      verifiedUsers: users.filter(user => user.isVerified === true).length,
      adminUsers: users.filter(user => user.isAdmin === true).length,
      emailVerifiedUsers: users.filter(user => user.emailVerified === true).length,
      mobileVerifiedUsers: users.filter(user => user.mobileVerified === true).length,
      recentUsers: users.filter(user => new Date(user.createdAt) > sevenDaysAgo).length
    }
    
    return stats
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return null
  }
}

export default function DashboardHome() {
  const { data: stats, isLoading, error, mutate } = useSWR("dashboard-stats", fetchDashboardStats)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse delay-1000" />
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">Welcome to the Admin Dashboard</p>
            </div>
            {error && (
              <button
                onClick={() => mutate()}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                Retry
              </button>
            )}
          </div>
        </div>
        
        {/* Error State */}
        {error && (
          <div className="mb-8 backdrop-blur-sm bg-red-50/70 border border-red-200 rounded-2xl p-6 shadow-xl animate-fade-up">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500 text-white">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">Failed to Load Dashboard Data</h3>
                <p className="text-red-600 text-sm">Unable to fetch user statistics. Please check your connection and try again.</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
          <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {isLoading ? "…" : (stats?.totalUsers ?? "-")}
                </div>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Registered users in the system</p>
          </div>

          <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <Shield className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {isLoading ? "…" : (stats?.verifiedUsers ?? "-")}
                </div>
                <p className="text-sm text-gray-600">Verified Users</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Users with verified accounts</p>
          </div>

          <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <Crown className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {isLoading ? "…" : (stats?.adminUsers ?? "-")}
                </div>
                <p className="text-sm text-gray-600">Admin Users</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Administrator accounts</p>
          </div>

          <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                <Mail className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {isLoading ? "…" : (stats?.emailVerifiedUsers ?? "-")}
                </div>
                <p className="text-sm text-gray-600">Email Verified</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Users with verified email</p>
          </div>

          <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                <Smartphone className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {isLoading ? "…" : (stats?.mobileVerifiedUsers ?? "-")}
                </div>
                <p className="text-sm text-gray-600">Mobile Verified</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Users with verified mobile</p>
          </div>

          <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {isLoading ? "…" : (stats?.recentUsers ?? "-")}
                </div>
                <p className="text-sm text-gray-600">New This Week</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Users registered in last 7 days</p>
          </div>
        </div>

        {/* Additional Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Recent Activity
              </h3>
            </div>
            <div className="text-sm text-gray-600">
              No recent activity to display.
            </div>
          </div>

          <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <CheckCircle className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                System Status
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">All systems operational</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Quick Actions
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-white/50 border border-white/30 hover:bg-white/70 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">View Users</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/50 border border-white/30 hover:bg-white/70 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Analytics</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/50 border border-white/30 hover:bg-white/70 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">Recent Activity</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/50 border border-white/30 hover:bg-white/70 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Security</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}