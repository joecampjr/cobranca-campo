import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { ExternalLink, Calendar, User } from "lucide-react"

async function getRecentCharges(companyId: string) {
  try {
    const result = await db.query(`
      SELECT 
          c.id, 
          c.amount, 
          c.status, 
          c.created_at, 
          cust.name as customer_name, 
          cust.document as customer_cpf, 
          c.asaas_invoice_url,
          u.name as collector_name
      FROM charges c
      LEFT JOIN users u ON c.collector_id = u.id
      LEFT JOIN customers cust ON c.customer_id = cust.id
      WHERE c.company_id = $1
      ORDER BY c.created_at DESC
      LIMIT 20
    `, [companyId])

    return { data: result.rows, error: null }
  } catch (error) {
    console.error("Dashboard SQL Error:", error)
    return { data: [], error: error instanceof Error ? error.message : String(error) }
  }
}

export default async function ManagerDashboardPage() {
  const user = await getCurrentUser()

  if (!user || !["manager", "company_admin"].includes(user.role)) {
    redirect("/signin")
  }

  const { data: charges, error } = await getRecentCharges(user.company_id)

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" }> = {
    "PENDING": { label: "Pendente", variant: "secondary" },
    "RECEIVED": { label: "Pago", variant: "success" },
    "CONFIRMED": { label: "Confirmado", variant: "success" },
    "OVERDUE": { label: "Vencido", variant: "destructive" },
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Painel de Cobranças</h1>
        <p className="text-muted-foreground">Acompanhamento em tempo real das cobranças geradas.</p>
      </div>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Erro no Banco de Dados: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Últimas Cobranças</CardTitle>
            <CardDescription>Lista das últimas 20 cobranças geradas pela equipe.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {charges.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma cobrança registrada ainda.
                </div>
              ) : (
                charges.map((charge) => (
                  <div key={charge.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4">

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">{charge.customer_name || "Cliente sem nome"}</span>
                        <Badge variant={statusMap[charge.status]?.variant || "outline"}>
                          {statusMap[charge.status]?.label || charge.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>Cobrador: {charge.collector_name || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="font-mono">{charge.customer_cpf}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(charge.created_at).toLocaleString("pt-BR")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between md:justify-end w-full md:w-auto">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Valor</div>
                        <div className="text-xl font-bold text-primary">
                          R$ {Number(charge.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      {charge.asaas_invoice_url && (
                        <a href={charge.asaas_invoice_url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" className="gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Link
                          </Button>
                        </a>
                      )}
                    </div>

                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
