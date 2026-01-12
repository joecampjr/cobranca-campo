import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Clock, CheckCircle2, Plus, LogOut } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/db"
import { formatCurrency } from "@/lib/utils"
// import { SignOutButton } from "@/components/auth/signout-button" // If exists, or direct fetch

export default async function CollectorHomePage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "collector") {
    redirect("/signin")
  }

  // Fetch Stats: Total Collected and Pending Count
  // Collected: status = 'paid' or 'received' (asaas might use RECEIVED)
  // Pending: status = 'pending' or 'overdue'

  const statsRes = await db.query(`
    SELECT 
        COALESCE(SUM(CASE WHEN status IN ('paid', 'received', 'confirmed') THEN amount ELSE 0 END), 0) as total_collected,
        COUNT(CASE WHEN status IN ('pending', 'overdue') THEN 1 END) as pending_count
    FROM charges 
    WHERE collector_id = $1
  `, [user.id])

  const stats = {
    collected: Number(statsRes.rows[0].total_collected),
    pending: Number(statsRes.rows[0].pending_count)
  }

  // Fetch Recent Charges
  const chargesRes = await db.query(`
    SELECT c.*, cust.name as customer_name 
    FROM charges c
    JOIN customers cust ON c.customer_id = cust.id
    WHERE c.collector_id = $1
    ORDER BY c.created_at DESC
    LIMIT 5
  `, [user.id])

  const recentCharges = chargesRes.rows

  // Fetch branding (Logo)
  const brandingRes = await db.query("SELECT display_name, logo_url FROM companies WHERE id = $1", [user.company_id])
  const branding = brandingRes.rows[0] || {}

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <header className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-3">
          {branding.logo_url ? (
            <img src={branding.logo_url} alt="Logo" className="h-10 w-10 rounded-lg object-contain bg-white border" />
          ) : (
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              {branding.display_name?.charAt(0) || "C"}
            </div>
          )}
          <div>
            <h1 className="font-bold text-lg leading-tight">{branding.display_name || "Cobrança"}</h1>
            <p className="text-xs text-muted-foreground">Olá, {user.name}</p>
          </div>
        </div>

        {/* SignOut - maybe moving to profile, but good to have access? Or just keep it clean */}
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="bg-primary-foreground/20 p-2 rounded-full w-fit mb-2">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm opacity-80">Total Coletado</p>
              <p className="text-xl font-bold">{formatCurrency(stats.collected)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 p-2 rounded-full w-fit mb-2">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-xl font-bold text-foreground">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Link href="/collector/new-charge">
        <Button className="w-full py-6 text-lg shadow-md" size="lg">
          <Plus className="mr-2 h-6 w-6" />
          Nova Cobrança
        </Button>
      </Link>

      {/* Recent Activity */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Últimas Atividades</h3>
        {recentCharges.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-card rounded-lg border border-dashed">
            <p>Nenhuma cobrança recente.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentCharges.map(charge => (
              <Card key={charge.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-3 gap-3">
                    <div className={`
                                     h-10 w-10 rounded-full flex items-center justify-center
                                     ${charge.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}
                                 `}>
                      {charge.status === 'pending' ? <Clock className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{charge.customer_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(charge.created_at).toLocaleDateString('pt-BR')} • {charge.payment_method}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(Number(charge.amount))}</p>
                      <p className="text-[10px] uppercase text-muted-foreground">{charge.status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="mt-4 text-center">
          <Link href="/collector/history" className="text-sm text-primary hover:underline">
            Ver todo o histórico
          </Link>
        </div>
      </div>
    </div>
  )
}
