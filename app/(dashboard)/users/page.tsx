"use client"

import { useState } from "react"
import { UsersTable } from "@/components/19pays/user-table"
import { Users, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function UsersPage() {
  const [search, setSearch] = useState<string>("")

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
              <Users className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Users Management
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Manage and monitor all registered users</p>
        </div>

        {/* Search and Filters */}
        <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name, email, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-300"
              />
            </div>
            <Button 
              variant="outline" 
              className="bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl shadow-xl animate-fade-up hover:shadow-2xl transition-all duration-300">
          <UsersTable search={search} />
        </div>
      </div>
    </div>
  )
}