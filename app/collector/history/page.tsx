import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Clock, XCircle } from "lucide-react" // Added icons for status
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { AutoRefresh } from "@/components/auto-refresh"
import { formatCurrency } from "@/lib/utils"

export default async function CollectorHistoryPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "collector") {
    redirect("/signin")
  }

  // Fetch History: All charges created by this collector
  const historyRes = await db.query(`
    SELECT c.*, cust.name as customer_name 
    FROM charges c
    JOIN customers cust ON c.customer_id = cust.id
    WHERE c.collector_id = $1
    ORDER BY c.created_at DESC
    LIMIT 50
  `, [user.id])

  const history = historyRes.rows

  return (
    <div className="space-y-4 p-4">
      <header className="pb-4 border-b">
        <h1 className="text-xl font-bold">Histórico de Cobranças</h1>
        <p className="text-sm text-muted-foreground">Suas últimas 50 atividades.</p>
      </header>

      {history.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Nenhuma cobrança encontrada.</p>
        </div>
      ) : (
        <main className="space-y-3">
          {history.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`
                        h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0
                        ${item.status === 'paid' || item.status === 'received' ? 'bg-green-100 text-green-600' : ''}
                        ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : ''}
                        ${item.status === 'overdue' ? 'bg-red-100 text-red-600' : ''}
                  `}>
                  {item.status === 'pending' && <Clock className="h-5 w-5" />}
                  {(item.status === 'paid' || item.status === 'received') && <CheckCircle2 className="h-5 w-5" />}
                  {item.status === 'overdue' && <XCircle className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{item.customer_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString("pt-BR")} às {new Date(item.created_at).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                        {item.due_date && (
                          <span className="block text-xs text-orange-600 font-medium mt-1">
                            Vence: {new Date(item.due_date).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                      </p>
                    </div>
                    <Badge variant={item.status === 'pending' ? "outline" : "default"}>
                      {item.payment_method}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-lg font-bold">
                      {formatCurrency(Number(item.amount))}
                    </p>
                    <span className="text-xs uppercase font-medium opacity-70">
                      {item.status === 'received' ? 'Recebido' : item.status}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </main>
      )}
      <AutoRefresh />
    </div>
  )
}
