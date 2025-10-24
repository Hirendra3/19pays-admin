"use client"

import { useRouter, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { clearToken, useAuthToken } from "@/hooks/use-auth"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, User, LogOut, Settings, Shield } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { cn } from "@/lib/utils"

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/users", label: "Users", icon: "👥" },
  { href: "/reports", label: "Reports", icon: "📈" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
]

function MobileSidebarContent({ onLinkClick }: { onLinkClick: () => void }) {
  const pathname = usePathname()
  return (
    <>
      <div className="h-16 flex items-center px-6 border-b bg-gradient-to-r from-indigo-600 to-cyan-600">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/20 text-white">
            <Shield className="h-5 w-5" />
          </div>
          <span className="font-bold text-white">Admin Portal</span>
        </div>
      </div>
      <nav className="p-4 bg-gradient-to-b from-slate-50 to-blue-50">
        <ul className="grid gap-2">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={onLinkClick}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300",
                    active 
                      ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg" 
                      : "text-gray-700 hover:bg-white/70 hover:shadow-md"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="text-lg">{l.icon}</span>
                  {l.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}

export function Navbar({ onSearch }: { onSearch?: (q: string) => void }) {
  const router = useRouter()
  const pathname = usePathname()
  const token = useAuthToken()
  const [q, setQ] = useState("")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    setQ("")
  }, [pathname])

  const handleMobileLinkClick = () => {
    setIsMobileSidebarOpen(false)
  }

  function logout() {
    clearToken()
    router.replace("/login")
  }

  return (
    <header className="h-16 border-b bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        {isMobile && (
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="md:hidden bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300"
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <MobileSidebarContent onLinkClick={handleMobileLinkClick} />
            </SheetContent>
          </Sheet>
        )}
        
        {/* Search Bar */}
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                onSearch?.(e.target.value)
              }}
              placeholder="Search users, reports..."
              aria-label="Search"
              className="pl-10 bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-300"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="rounded-full px-4 py-2 bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                <span className="hidden sm:inline text-sm font-medium">
                  {token ? "Admin" : "Guest"}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white/90 backdrop-blur-sm border-white/30">
            <DropdownMenuLabel className="flex items-center gap-2">
              <User className="h-4 w-4" />
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => router.push("/settings")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Settings className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={logout}
              className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}