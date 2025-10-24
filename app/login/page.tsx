"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/adminlogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        let errorMessage = "Login failed"
        try {
          const errorData = await res.json()
          // Handle different error response formats
          if (errorData.error) {
            errorMessage = errorData.error
          } else if (errorData.message) {
            errorMessage = errorData.message
          } else if (typeof errorData === 'string') {
            errorMessage = errorData
          } else if (errorData.raw) {
            errorMessage = errorData.raw
          }
        } catch {
          // If JSON parsing fails, try to get text
          const text = await res.text()
          errorMessage = text || "Login failed"
        }
        throw new Error(errorMessage)
      }
      const data = await res.json()
      // Attempt common token shapes
      const token: string | undefined = data?.token || data?.jwt || data?.access_token || data?.data?.token
      if (!token) throw new Error("No token returned")
      localStorage.setItem("admin_token", token)
      toast({ title: "Logged in", description: "Welcome back!" })
      router.replace("/dashboard")
    } catch (err: any) {
      // Provide user-friendly error messages
      let errorMessage = "Login failed"
      
      if (err.message) {
        // Clean up common error messages
        const message = err.message.toLowerCase()
        if (message.includes('unauthorized') || message.includes('invalid credentials')) {
          errorMessage = "Invalid email or password"
        } else if (message.includes('network') || message.includes('fetch')) {
          errorMessage = "Network error. Please check your connection and try again."
        } else if (message.includes('timeout')) {
          errorMessage = "Request timed out. Please try again."
        } else if (message.includes('server') || message.includes('500')) {
          errorMessage = "Server error. Please try again later."
        } else if (message.includes('no token')) {
          errorMessage = "Authentication failed. Please check your credentials."
        } else {
          // For other errors, show the original message if it's not JSON
          if (!err.message.startsWith('{') && !err.message.startsWith('[')) {
            errorMessage = err.message
          }
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse delay-1000" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl shadow-xl animate-fade-up">
          <CardHeader className="text-center p-8 pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-white">
                <Shield className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Sign in to manage the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@19pays.com"
                    className="pl-10 bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? "Signing in…" : "Sign in"}
              </Button>
              
              {error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              ) : null}
            </form>
          </CardContent>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Secure admin access to 19Pays platform
          </p>
        </div>
      </div>
    </div>
  )
}