import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function CollectorRoutePage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "collector") {
    redirect("/signin")
  }

  // Mock data
  const route = {
    id: "1",
    name: "Zona Norte - Manhã",
    customers: [
      {
        id: "1",
        name: "Ana Costa",
        address: "Rua das Flores, 123",
        amount: 450.0,
        status: "pending",
        order: 1,
      },
      {
        id: "2",
        name: "Carlos Silva",
        address: "Av. Paulista, 456",
        amount: 680.0,
        status: "pending",
        order: 2,
      },
      {
        id: "3",
        name: "Maria Santos",
        address: "Rua Augusta, 789",
        amount: 320.0,
        status: "completed",
        order: 3,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Mobile Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/collector">
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{route.name}</h1>
            <p className="text-xs text-muted-foreground">{route.customers.length} clientes</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-3">
        {route.customers.map((customer) => (
          <Card key={customer.id} className={`p-4 ${customer.status === "completed" ? "opacity-60" : ""}`}>
            <div className="flex items-start gap-3">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  customer.status === "completed"
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary/10 text-primary font-semibold"
                }`}
              >
                {customer.status === "completed" ? <CheckCircle2 className="h-5 w-5" /> : customer.order}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold mb-1">{customer.name}</h3>
                    <div className="flex items-start gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{customer.address}</span>
                    </div>
                  </div>
                  {customer.status === "completed" ? (
                    <Badge variant="default" className="bg-accent">
                      Concluída
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Pendente</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-lg font-bold">
                    R$ {customer.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  {customer.status === "pending" && (
                    <Link href={`/collector/customer/${customer.id}`}>
                      <Button size="sm">
                        <Navigation className="h-4 w-4 mr-2" />
                        Navegar
                      </Button>
                    </Link>
                  )}
                </div>
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
            <Button variant="ghost" className="flex-col h-auto py-2 w-full text-primary">
              <Navigation className="h-5 w-5 mb-1" />
              <span className="text-xs">Rota</span>
            </Button>
          </Link>
          <Link href="/collector/history">
            <Button variant="ghost" className="flex-col h-auto py-2 w-full">
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
