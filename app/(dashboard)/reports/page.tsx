import { BarChart3, TrendingUp, FileText, Download, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportsPage() {
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
              <BarChart3 className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Reports & Analytics
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Generate and view detailed reports</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">-</div>
                <p className="text-sm text-gray-600">Total Reports</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Generated reports</p>
          </div>

          <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                <FileText className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">-</div>
                <p className="text-sm text-gray-600">Active Reports</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Currently available</p>
          </div>

          <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <Download className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">-</div>
                <p className="text-sm text-gray-600">Downloads</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">This month</p>
          </div>

          <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">-</div>
                <p className="text-sm text-gray-600">Scheduled</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Auto-generated</p>
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-8 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-white">
              <BarChart3 className="h-12 w-12" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports Module Coming Soon</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            We're working on bringing you comprehensive reporting and analytics features. 
            Stay tuned for detailed insights into your platform's performance.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-lg bg-white/50 border border-white/30">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-700">Analytics</span>
              </div>
              <p className="text-sm text-gray-500">User engagement metrics</p>
            </div>
            
            <div className="p-4 rounded-lg bg-white/50 border border-white/30">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-700">Reports</span>
              </div>
              <p className="text-sm text-gray-500">Detailed data exports</p>
            </div>
            
            <div className="p-4 rounded-lg bg-white/50 border border-white/30">
              <div className="flex items-center gap-3 mb-2">
                <Filter className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-gray-700">Filters</span>
              </div>
              <p className="text-sm text-gray-500">Custom date ranges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}