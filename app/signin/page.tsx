"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erro ao fazer login")
        return
      }

      // Redirect based on user role
      if (data.user.role === "super_admin") {
        router.push("/admin")
      } else if (data.user.role === "company_admin") {
        router.push("/admin/dashboard")
      } else if (data.user.role === "manager") {
        router.push("/manager/dashboard")
      } else if (data.user.role === "collector") {
        router.push("/collector")
      } else {
        router.push("/customer/portal")
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Entrar</h1>
          <p className="text-muted-foreground text-sm">Acesse sua conta Cobrança em Campo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Não tem uma conta? </span>
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Criar conta grátis
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar para página inicial
          </Link>
        </div>
      </Card>
    </div>
  )
}
