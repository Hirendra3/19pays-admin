"use client"

import { Button } from "@/components/ui/button"
import { clearToken } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Settings, LogOut, User, Shield, Bell, Database, Palette, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse delay-1000" />
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-white">
              <Settings className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Settings
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Manage your account and application preferences</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Account Settings */}
          <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <User className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Account Settings
              </h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/50 border border-white/30">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <p className="text-sm text-gray-500 mt-1">admin@19pays.com</p>
              </div>
              <div className="p-4 rounded-lg bg-white/50 border border-white/30">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">Role</Label>
                <p className="text-sm text-gray-500 mt-1">Administrator</p>
              </div>
              <div className="p-4 rounded-lg bg-white/50 border border-white/30">
                <Label htmlFor="last-login" className="text-sm font-medium text-gray-700">Last Login</Label>
                <p className="text-sm text-gray-500 mt-1">Just now</p>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 text-white">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Security
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 border border-white/30">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Two-Factor Authentication</Label>
                  <p className="text-xs text-gray-500">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 border border-white/30">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Session Timeout</Label>
                  <p className="text-xs text-gray-500">Auto-logout after inactivity</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button 
                variant="outline" 
                className="w-full bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300"
              >
                Change Password
              </Button>
            </div>
          </div>

          {/* Notifications */}
          <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                <Bell className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Notifications
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 border border-white/30">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email Notifications</Label>
                  <p className="text-xs text-gray-500">Receive updates via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 border border-white/30">
                <div>
                  <Label className="text-sm font-medium text-gray-700">System Alerts</Label>
                  <p className="text-xs text-gray-500">Important system notifications</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 border border-white/30">
                <div>
                  <Label className="text-sm font-medium text-gray-700">User Activity</Label>
                  <p className="text-xs text-gray-500">New user registrations</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                System
              </h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/50 border border-white/30">
                <Label className="text-sm font-medium text-gray-700">Database Status</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-500">Connected</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/50 border border-white/30">
                <Label className="text-sm font-medium text-gray-700">API Status</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-500">Operational</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/50 border border-white/30">
                <Label className="text-sm font-medium text-gray-700">Last Backup</Label>
                <p className="text-sm text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="mt-8">
          <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Management</h3>
                <p className="text-sm text-gray-600">Sign out of your admin account</p>
              </div>
        <Button
          variant="destructive"
          onClick={() => {
            clearToken()
            router.replace("/login")
          }}
                className="bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
        >
                <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}