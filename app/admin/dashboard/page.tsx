import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Building2, Users, DollarSign, TrendingUp, Clock, CheckCircle2 } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { StatsCard } from "@/components/admin/stats-card"

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()

  if (!user || (user.role !== "company_admin" && user.role !== "super_admin")) {
    redirect("/signin")
  }

  // Mock data - replace with real database queries
  const stats = {
    totalCustomers: 1247,
    activeCollectors: 12,
    monthlyRevenue: 87450.0,
    collectionRate: 78.5,
    pendingCharges: 234,
    completedToday: 45,
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <AdminHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da sua operação de cobranças</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Clientes Cadastrados"
            value={stats.totalCustomers.toLocaleString("pt-BR")}
            icon={Building2}
            trend="+12% este mês"
            trendUp
          />
          <StatsCard
            title="Cobradores Ativos"
            value={stats.activeCollectors.toString()}
            icon={Users}
            trend="2 em campo agora"
          />
          <StatsCard
            title="Receita Mensal"
            value={`R$ ${stats.monthlyRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            icon={DollarSign}
            trend="+8.2% vs mês anterior"
            trendUp
          />
          <StatsCard
            title="Taxa de Cobrança"
            value={`${stats.collectionRate}%`}
            icon={TrendingUp}
            trend="+3.1% este mês"
            trendUp
          />
          <StatsCard
            title="Cobranças Pendentes"
            value={stats.pendingCharges.toString()}
            icon={Clock}
            trend="15 vencidas"
          />
          <StatsCard
            title="Concluídas Hoje"
            value={stats.completedToday.toString()}
            icon={CheckCircle2}
            trend="Meta: 60 cobranças"
          />
        </div>

        {/* Recent Activity & Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>
            <div className="space-y-4">
              <ActivityItem
                title="Nova cobrança recebida"
                description="João Silva - R$ 450,00"
                time="Há 5 minutos"
                type="success"
              />
              <ActivityItem
                title="Cobrador iniciou rota"
                description="Maria Santos - Zona Norte (8 clientes)"
                time="Há 15 minutos"
                type="info"
              />
              <ActivityItem
                title="Cobrança vencida"
                description="Carlos Oliveira - R$ 280,00"
                time="Há 1 hora"
                type="warning"
              />
              <ActivityItem
                title="Novo cliente cadastrado"
                description="Ana Costa - São Paulo, SP"
                time="Há 2 horas"
                type="info"
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Cobranças por Status</h2>
            <div className="space-y-4">
              <StatusBar label="Pagas" value={450} total={600} color="bg-accent" />
              <StatusBar label="Pendentes" value={120} total={600} color="bg-yellow-500" />
              <StatusBar label="Vencidas" value={30} total={600} color="bg-destructive" />
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

function ActivityItem({
  title,
  description,
  time,
  type,
}: {
  title: string
  description: string
  time: string
  type: "success" | "warning" | "info"
}) {
  const colors = {
    success: "bg-accent/10 text-accent",
    warning: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500",
    info: "bg-primary/10 text-primary",
  }

  return (
    <div className="flex gap-3 items-start">
      <div className={`h-2 w-2 rounded-full mt-2 ${colors[type].split(" ")[0].replace("/10", "")}`} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  )
}

function StatusBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const percentage = (value / total) * 100

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {value} / {total}
        </span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
