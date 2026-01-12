import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ManagerHeader } from "@/components/manager/manager-header"
import { Plus, MapPin, Calendar, UsersIcon } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function RoutesPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "manager") {
    redirect("/signin")
  }

  // Mock data
  const routes = [
    {
      id: "1",
      name: "Zona Norte - Manhã",
      date: "2026-01-12",
      collector: "Maria Santos",
      status: "in_progress",
      customers: 12,
      completed: 8,
      totalAmount: 4500.0,
      collectedAmount: 3200.0,
    },
    {
      id: "2",
      name: "Centro - Tarde",
      date: "2026-01-12",
      collector: "Pedro Oliveira",
      status: "in_progress",
      customers: 10,
      completed: 6,
      totalAmount: 3800.0,
      collectedAmount: 2100.0,
    },
    {
      id: "3",
      name: "Zona Sul",
      date: "2026-01-13",
      collector: null,
      status: "planned",
      customers: 15,
      completed: 0,
      totalAmount: 5200.0,
      collectedAmount: 0,
    },
  ]

  const statusColors = {
    planned: "secondary",
    in_progress: "default",
    completed: "default",
  } as const

  const statusLabels = {
    planned: "Planejada",
    in_progress: "Em Andamento",
    completed: "Concluída",
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <ManagerHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Rotas de Cobrança</h1>
            <p className="text-muted-foreground">Gerencie e otimize as rotas da sua equipe</p>
          </div>
          <Link href="/manager/routes/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Rota
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {routes.map((route) => (
            <Card key={route.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold">{route.name}</h3>
                        <Badge variant={statusColors[route.status]}>{statusLabels[route.status]}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(route.date).toLocaleDateString("pt-BR")}</span>
                        </div>
                        {route.collector && (
                          <div className="flex items-center gap-1">
                            <UsersIcon className="h-4 w-4" />
                            <span>{route.collector}</span>
                          </div>
                        )}
                        <span>{route.customers} clientes</span>
                      </div>
                    </div>
                  </div>

                  {route.status === "in_progress" && (
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-medium">
                          {route.completed} / {route.customers}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${(route.completed / route.customers) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Valor Total</p>
                    <p className="text-xl font-bold">
                      R$ {route.totalAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    {route.collectedAmount > 0 && (
                      <p className="text-sm text-accent">
                        R$ {route.collectedAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} coletado
                      </p>
                    )}
                  </div>
                  <Link href={`/manager/routes/${route.id}`}>
                    <Button variant="outline">Ver Detalhes</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
