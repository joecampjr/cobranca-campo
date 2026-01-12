import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function CustomerPortalPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "customer") {
    redirect("/signin")
  }

  // Mock data
  const summary = {
    totalPending: 1450.0,
    totalOverdue: 280.0,
    totalPaid: 3200.0,
    nextDueDate: "2026-01-20",
  }

  const charges = [
    {
      id: "1",
      description: "Mensalidade Janeiro 2026",
      amount: 450.0,
      dueDate: "2026-01-15",
      status: "pending",
      canPay: true,
    },
    {
      id: "2",
      description: "Parcela 2/3 - Serviço XYZ",
      amount: 1000.0,
      dueDate: "2026-01-20",
      status: "pending",
      canPay: true,
    },
    {
      id: "3",
      description: "Mensalidade Dezembro 2025",
      amount: 280.0,
      dueDate: "2025-12-10",
      status: "overdue",
      canPay: true,
    },
    {
      id: "4",
      description: "Mensalidade Novembro 2025",
      amount: 450.0,
      dueDate: "2025-11-10",
      status: "paid",
      paidAt: "2025-11-08",
      canPay: false,
    },
  ]

  const statusConfig = {
    pending: {
      label: "Pendente",
      variant: "secondary" as const,
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-500",
    },
    overdue: {
      label: "Vencida",
      variant: "destructive" as const,
      icon: AlertCircle,
      color: "text-destructive",
    },
    paid: {
      label: "Pago",
      variant: "default" as const,
      icon: CheckCircle2,
      color: "text-accent",
    },
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Portal do Cliente</span>
            </div>
            <Link href="/api/auth/signout">
              <Button variant="ghost" size="sm">
                Sair
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Olá, {user.name}!</h1>
          <p className="text-muted-foreground">Acompanhe suas cobranças e realize pagamentos</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500 mb-2">
              <Clock className="h-5 w-5" />
              <p className="text-sm font-medium">Pendente</p>
            </div>
            <p className="text-2xl font-bold">
              R$ {summary.totalPending.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">Vencido</p>
            </div>
            <p className="text-2xl font-bold">
              R$ {summary.totalOverdue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 text-accent mb-2">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm font-medium">Pago</p>
            </div>
            <p className="text-2xl font-bold">
              R$ {summary.totalPaid.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </Card>

          <Card className="p-6 bg-primary/5 border-primary">
            <div className="flex items-center gap-2 text-primary mb-2">
              <FileText className="h-5 w-5" />
              <p className="text-sm font-medium">Próximo Vencimento</p>
            </div>
            <p className="text-lg font-bold">{new Date(summary.nextDueDate).toLocaleDateString("pt-BR")}</p>
          </Card>
        </div>

        {/* Charges List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Minhas Cobranças</h2>
          <div className="space-y-4">
            {charges.map((charge) => {
              const config = statusConfig[charge.status]
              const StatusIcon = config.icon

              return (
                <Card key={charge.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`h-12 w-12 rounded-lg flex items-center justify-center ${config.color} bg-current/10`}
                      >
                        <StatusIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">{charge.description}</h3>
                            <p className="text-sm text-muted-foreground">
                              Vencimento: {new Date(charge.dueDate).toLocaleDateString("pt-BR")}
                            </p>
                            {charge.paidAt && (
                              <p className="text-sm text-accent mt-1">
                                Pago em {new Date(charge.paidAt).toLocaleDateString("pt-BR")}
                              </p>
                            )}
                          </div>
                          <Badge variant={config.variant}>{config.label}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Valor</p>
                        <p className="text-2xl font-bold">
                          R$ {charge.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      {charge.canPay && (
                        <Link href={`/customer/pay/${charge.id}`}>
                          <Button>Pagar Agora</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
