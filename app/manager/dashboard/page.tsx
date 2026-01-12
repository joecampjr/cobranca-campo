import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ManagerHeader } from "@/components/manager/manager-header"
import { Users, MapPin, CheckCircle2, Clock, DollarSign, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function ManagerDashboardPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "manager") {
    redirect("/signin")
  }

  // Mock data
  const stats = {
    activeCollectors: 5,
    todayRoutes: 3,
    completedToday: 28,
    pendingToday: 12,
    collectedToday: 8450.0,
    teamGoal: 50000.0,
    teamAchieved: 32800.0,
  }

  const activeCollectors = [
    {
      id: "1",
      name: "Maria Santos",
      route: "Zona Norte",
      progress: 8,
      total: 12,
      location: "Rua das Flores, 123",
      lastUpdate: "5 min atrás",
    },
    {
      id: "2",
      name: "Pedro Oliveira",
      route: "Centro",
      progress: 6,
      total: 10,
      location: "Av. Paulista, 456",
      lastUpdate: "2 min atrás",
    },
  ]

  return (
    <div className="min-h-screen bg-muted/20">
      <ManagerHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard do Gerente</h1>
          <p className="text-muted-foreground">Gerencie sua equipe e acompanhe as rotas em tempo real</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Cobradores Ativos</p>
                <h3 className="text-2xl font-bold">{stats.activeCollectors}</h3>
                <p className="text-sm text-muted-foreground mt-1">{stats.todayRoutes} rotas hoje</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Concluídas Hoje</p>
                <h3 className="text-2xl font-bold">{stats.completedToday}</h3>
                <p className="text-sm text-accent mt-1">+12% vs ontem</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Pendentes</p>
                <h3 className="text-2xl font-bold">{stats.pendingToday}</h3>
                <p className="text-sm text-muted-foreground mt-1">Para hoje</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Coletado Hoje</p>
                <h3 className="text-2xl font-bold">
                  R$ {stats.collectedToday.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                </h3>
                <p className="text-sm text-accent mt-1">Meta: R$ 10.000</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>
        </div>

        {/* Team Goal Progress */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Meta da Equipe - Janeiro 2026</h2>
              <p className="text-sm text-muted-foreground">Progresso mensal da equipe</p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <span className="text-2xl font-bold text-accent">
                {((stats.teamAchieved / stats.teamGoal) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${(stats.teamAchieved / stats.teamGoal) * 100}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            R$ {stats.teamAchieved.toLocaleString("pt-BR")} de R$ {stats.teamGoal.toLocaleString("pt-BR")}
          </p>
        </Card>

        {/* Active Collectors & Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Cobradores em Campo</h2>
              <Link href="/manager/routes">
                <Button variant="outline" size="sm">
                  Ver Todas as Rotas
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {activeCollectors.map((collector) => (
                <Card key={collector.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">{collector.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{collector.name}</h3>
                        <p className="text-sm text-muted-foreground">{collector.route}</p>
                      </div>
                    </div>
                    <Badge>Em campo</Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">
                        {collector.progress} / {collector.total}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(collector.progress / collector.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{collector.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Última atualização: {collector.lastUpdate}</span>
                    <Link href={`/manager/collectors/${collector.id}/track`}>
                      <Button variant="ghost" size="sm">
                        Rastrear
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
            <div className="space-y-3">
              <Link href="/manager/routes/new">
                <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Criar Nova Rota</h3>
                      <p className="text-xs text-muted-foreground">Planejar rota de cobrança</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/manager/team">
                <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Gerenciar Equipe</h3>
                      <p className="text-xs text-muted-foreground">Ver performance e metas</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/manager/reports">
                <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Relatórios</h3>
                      <p className="text-xs text-muted-foreground">Análises e métricas</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
