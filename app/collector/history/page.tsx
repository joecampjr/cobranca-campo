import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function CollectorHistoryPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "collector") {
    redirect("/signin")
  }

  // Mock data
  const history = [
    {
      id: "1",
      customer: "Maria Santos",
      amount: 320.0,
      date: "2026-01-12",
      time: "14:30",
      method: "PIX",
    },
    {
      id: "2",
      customer: "João Silva",
      amount: 450.0,
      date: "2026-01-12",
      time: "13:15",
      method: "Dinheiro",
    },
    {
      id: "3",
      customer: "Pedro Costa",
      amount: 680.0,
      date: "2026-01-11",
      time: "16:45",
      method: "PIX",
    },
  ]

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <header className="bg-card border-b p-4 sticky top-0 z-50">
        <h1 className="text-lg font-bold">Histórico de Cobranças</h1>
      </header>

      <main className="p-4 space-y-3">
        {history.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{item.customer}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.date).toLocaleDateString("pt-BR")} às {item.time}
                    </p>
                  </div>
                  <Badge>{item.method}</Badge>
                </div>
                <p className="text-lg font-bold">
                  R$ {item.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t">
        <div className="grid grid-cols-4 gap-1 p-2">
          <Link href="/collector">
            <Button variant="ghost" className="flex-col h-auto py-2 w-full">
              <MapPin className="h-5 w-5 mb-1" />
              <span className="text-xs">Início</span>
            </Button>
          </Link>
          <Link href="/collector/route">
            <Button variant="ghost" className="flex-col h-auto py-2 w-full">
              <Navigation className="h-5 w-5 mb-1" />
              <span className="text-xs">Rota</span>
            </Button>
          </Link>
          <Link href="/collector/history">
            <Button variant="ghost" className="flex-col h-auto py-2 w-full text-primary">
              <CheckCircle2 className="h-5 w-5 mb-1" />
              <span className="text-xs">Histórico</span>
            </Button>
          </Link>
          <Link href="/collector/profile">
            <Button variant="ghost" className="flex-col h-auto py-2 w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-1"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-xs">Perfil</span>
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  )
}
