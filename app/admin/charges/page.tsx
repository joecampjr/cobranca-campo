import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"
import { Plus, Filter } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function ChargesPage() {
  const user = await getCurrentUser()

  if (!user || (user.role !== "company_admin" && user.role !== "super_admin")) {
    redirect("/signin")
  }

  // Mock data
  const charges = [
    {
      id: "1",
      customer: "João Silva",
      description: "Mensalidade Janeiro 2026",
      amount: 450.0,
      dueDate: "2026-01-15",
      status: "paid",
      paidAt: "2026-01-14",
      collector: "Maria Santos",
    },
    {
      id: "2",
      customer: "Maria Santos",
      description: "Parcela 2/3",
      amount: 890.5,
      dueDate: "2026-01-20",
      status: "pending",
      collector: "Pedro Oliveira",
    },
    {
      id: "3",
      customer: "Carlos Oliveira",
      description: "Mensalidade Dezembro 2025",
      amount: 280.0,
      dueDate: "2025-12-10",
      status: "overdue",
      collector: "Maria Santos",
    },
  ]

  const statusColors = {
    paid: "default",
    pending: "secondary",
    overdue: "destructive",
  } as const

  const statusLabels = {
    paid: "Pago",
    pending: "Pendente",
    overdue: "Vencido",
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <AdminHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cobranças</h1>
            <p className="text-muted-foreground">Gerencie todas as cobranças</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Link href="/admin/charges/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Cobrança
              </Button>
            </Link>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Cliente</th>
                  <th className="text-left p-4 font-medium">Descrição</th>
                  <th className="text-left p-4 font-medium">Valor</th>
                  <th className="text-left p-4 font-medium">Vencimento</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Cobrador</th>
                  <th className="text-left p-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {charges.map((charge) => (
                  <tr key={charge.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium">{charge.customer}</td>
                    <td className="p-4 text-muted-foreground">{charge.description}</td>
                    <td className="p-4 font-semibold">
                      R$ {charge.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(charge.dueDate).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-4">
                      <Badge variant={statusColors[charge.status]}>{statusLabels[charge.status]}</Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{charge.collector}</td>
                    <td className="p-4">
                      <Link href={`/admin/charges/${charge.id}`}>
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  )
}
