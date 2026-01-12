import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, CheckCircle2, Clock, DollarSign } from "lucide-react"
import Link from "next/link"

export default async function CollectorHomePage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "collector") {
    redirect("/signin")
  }

  // Mock data
  const todayStats = {
    completed: 8,
    pending: 4,
    total: 12,
    collected: 3420.0,
    goal: 5000.0,
  }

  const currentRoute = {
    id: "1",
    name: "Zona Norte - Manhã",
    customers: 12,
    completed: 8,
  }

  const nextCustomers = [
    {
      id: "1",
      name: "Ana Costa",
      address: "Rua das Flores, 123",
      amount: 450.0,
      distance: "1.2 km",
    },
    {
      id: "2",
      name: "Carlos Silva",
      address: "Av. Paulista, 456",
      amount: 680.0,
      distance: "2.5 km",
    },
  ]

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Mobile Header */}
      <header className="bg-primary text-primary-foreground p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">{user.name}</h1>
            <p className="text-sm opacity-90">Cobrador</p>
          </div>
          <Link href="/collector/settings">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
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
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3" />
              </svg>
            </Button>
          </Link>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Current Route Card */}
        <Card className="p-4 bg-primary text-primary-foreground">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm opacity-90">Rota Atual</p>
              <h2 className="font-semibold">{currentRoute.name}</h2>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Progresso</span>
            <span className="font-semibold">
              {currentRoute.completed} / {currentRoute.customers}
            </span>
          </div>
          <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-foreground transition-all"
              style={{ width: `${(currentRoute.completed / currentRoute.customers) * 100}%` }}
            />
          </div>
        </Card>

        {/* Today Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <p className="text-xs text-muted-foreground">Concluídas</p>
            </div>
            <p className="text-2xl font-bold">{todayStats.completed}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </div>
            <p className="text-2xl font-bold">{todayStats.pending}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-accent" />
              <p className="text-xs text-muted-foreground">Coletado</p>
            </div>
            <p className="text-lg font-bold">
              R$ {todayStats.collected.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
            </p>
          </Card>
        </div>

        {/* Next Customers */}
        <div>
          <h3 className="font-semibold mb-3">Próximos Clientes</h3>
          <div className="space-y-3">
            {nextCustomers.map((customer, index) => (
              <Card key={customer.id} className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-semibold text-primary">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-1">{customer.name}</h4>
                    <div className="flex items-start gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{customer.address}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Navigation className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{customer.distance}</span>
                      </div>
                      <p className="text-lg font-bold">
                        R$ {customer.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
                <Link href={`/collector/customer/${customer.id}`}>
                  <Button className="w-full">
                    <Navigation className="h-4 w-4 mr-2" />
                    Navegar
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
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
