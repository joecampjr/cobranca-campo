import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import { ChargeItem } from "@/components/manager/charge-item"

async function getRecentCharges(user: any) {
  try {
    let query = `
      SELECT 
          c.id, 
          c.amount, 
          c.status, 
          c.created_at, 
          cust.name as customer_name, 
          cust.document as customer_cpf, 
          c.asaas_invoice_url,
          u.name as collector_name,
          u.branch as collector_branch
      FROM charges c
      LEFT JOIN users u ON c.collector_id = u.id
      LEFT JOIN customers cust ON c.customer_id = cust.id
      WHERE c.company_id = $1
    `
    const params = [user.company_id]

    // If manager, filter by their branch
    if (user.role === 'manager' && user.branch) {
      query += ` AND u.branch = $2`
      params.push(user.branch)
    }

    query += ` ORDER BY c.created_at DESC LIMIT 20`

    const result = await db.query(query, params)

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

  const { data: charges, error } = await getRecentCharges(user)

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
                  <ChargeItem key={charge.id} charge={charge} currentUserRole={user.role} />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
