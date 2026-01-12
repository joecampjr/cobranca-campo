import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { ManagerHeader } from "@/components/manager/manager-header"
import { TrendingUp, Target, DollarSign } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function TeamPage() {
  const user = await getCurrentUser()

  if (!user || !["manager", "company_admin"].includes(user.role)) {
    redirect("/signin")
  }

  // Mock data
  const team = [
    {
      id: "1",
      name: "Maria Santos",
      email: "maria@empresa.com",
      monthlyGoal: 15000.0,
      monthlyAchieved: 12400.0,
      todayCollections: 8,
      todayAmount: 3200.0,
      commission: 5,
      status: "active",
    },
    {
      id: "2",
      name: "Pedro Oliveira",
      email: "pedro@empresa.com",
      monthlyGoal: 12000.0,
      monthlyAchieved: 9800.0,
      todayCollections: 6,
      todayAmount: 2100.0,
      commission: 5,
      status: "active",
    },
    {
      id: "3",
      name: "Ana Costa",
      email: "ana@empresa.com",
      monthlyGoal: 10000.0,
      monthlyAchieved: 8400.0,
      todayCollections: 4,
      todayAmount: 1600.0,
      commission: 4.5,
      status: "active",
    },
  ]

  return (
    <div className="min-h-screen bg-muted/20">
      <ManagerHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Minha Equipe</h1>
          <p className="text-muted-foreground">Acompanhe o desempenho de cada cobrador</p>
        </div>

        <div className="grid gap-6">
          {team.map((member) => {
            const goalPercentage = (member.monthlyAchieved / member.monthlyGoal) * 100
            const commissionEarned = member.monthlyAchieved * (member.commission / 100)

            return (
              <Card key={member.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-semibold text-primary">{member.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{member.email}</p>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Target className="h-4 w-4" />
                            <span className="text-sm">Meta Mensal</span>
                          </div>
                          <p className="text-lg font-semibold">
                            R$ {member.monthlyGoal.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm">Alcançado</span>
                          </div>
                          <p className="text-lg font-semibold">
                            R$ {member.monthlyAchieved.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-sm">Comissão</span>
                          </div>
                          <p className="text-lg font-semibold">
                            R$ {commissionEarned.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-64">
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium">Progresso</span>
                        <span className={goalPercentage >= 100 ? "text-accent" : "text-muted-foreground"}>
                          {goalPercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${goalPercentage >= 100 ? "bg-accent" : "bg-primary"}`}
                          style={{ width: `${Math.min(goalPercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-muted-foreground mb-1">Hoje</p>
                      <p className="font-semibold">{member.todayCollections} cobranças</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {member.todayAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <Link href={`/manager/team/${member.id}`}>
                      <Button variant="outline" className="w-full bg-transparent">
                        Ver Detalhes
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
