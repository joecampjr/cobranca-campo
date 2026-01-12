import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"
import { Plus, MapPin } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function CollectorsPage() {
  const user = await getCurrentUser()

  if (!user || (user.role !== "company_admin" && user.role !== "super_admin")) {
    redirect("/signin")
  }

  // Mock data
  const collectors = [
    {
      id: "1",
      name: "Maria Santos",
      email: "maria@empresa.com",
      phone: "(11) 91234-5678",
      status: "active",
      currentRoute: "Zona Norte",
      todayCollections: 8,
      todayAmount: 3420.0,
      commission: 5,
      monthlyGoal: 50000.0,
      monthlyAchieved: 32500.0,
    },
    {
      id: "2",
      name: "Pedro Oliveira",
      email: "pedro@empresa.com",
      phone: "(11) 99876-5432",
      status: "active",
      currentRoute: null,
      todayCollections: 0,
      todayAmount: 0,
      commission: 5,
      monthlyGoal: 45000.0,
      monthlyAchieved: 28900.0,
    },
    {
      id: "3",
      name: "Ana Costa",
      email: "ana@empresa.com",
      phone: "(11) 98765-1234",
      status: "inactive",
      currentRoute: null,
      todayCollections: 0,
      todayAmount: 0,
      commission: 4,
      monthlyGoal: 40000.0,
      monthlyAchieved: 0,
    },
  ]

  return (
    <div className="min-h-screen bg-muted/20">
      <AdminHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cobradores</h1>
            <p className="text-muted-foreground">Gerencie sua equipe de cobradores</p>
          </div>
          <Link href="/admin/collectors/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cobrador
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {collectors.map((collector) => (
            <Card key={collector.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">{collector.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{collector.name}</h3>
                    <p className="text-sm text-muted-foreground">{collector.email}</p>
                  </div>
                </div>
                <Badge variant={collector.status === "active" ? "default" : "secondary"}>
                  {collector.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </div>

              {collector.currentRoute && (
                <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-3 py-2 rounded-lg mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>Em rota: {collector.currentRoute}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Hoje</p>
                  <p className="text-lg font-semibold">{collector.todayCollections} cobranças</p>
                  <p className="text-sm text-muted-foreground">
                    R$ {collector.todayAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Comissão</p>
                  <p className="text-lg font-semibold">{collector.commission}%</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Meta Mensal</span>
                  <span className="font-medium">
                    {((collector.monthlyAchieved / collector.monthlyGoal) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{ width: `${(collector.monthlyAchieved / collector.monthlyGoal) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  R$ {collector.monthlyAchieved.toLocaleString("pt-BR")} de R${" "}
                  {collector.monthlyGoal.toLocaleString("pt-BR")}
                </p>
              </div>

              <Link href={`/admin/collectors/${collector.id}`}>
                <Button variant="outline" className="w-full bg-transparent">
                  Ver Detalhes
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
