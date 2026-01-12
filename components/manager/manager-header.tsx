"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MapPin, Bell, Menu, Settings, LogOut, User, Users, Route } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User as UserType } from "@/lib/auth"

export function ManagerHeader({ user }: { user: UserType }) {
  const router = useRouter()

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" })
    router.push("/signin")
  }

  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/manager/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold hidden md:inline">Cobrança em Campo</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              <Link href="/manager/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link href="/manager/routes">
                <Button variant="ghost" size="sm">
                  <Route className="h-4 w-4 mr-2" />
                  Rotas
                </Button>
              </Link>
              <Link href="/manager/team">
                <Button variant="ghost" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Equipe
                </Button>
              </Link>
              <Link href="/manager/reports">
                <Button variant="ghost" size="sm">
                  Relatórios
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/manager/routes">Rotas</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/manager/team">Equipe</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/manager/reports">Relatórios</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden md:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/manager/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
