import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { DashboardView } from "@/components/manager/dashboard-view"
import { DeveloperFooter } from "@/components/developer-footer"

async function getDashboardData(user: any) {
  try {
    // 1. Get recent charges
    let chargeQuery = `
      SELECT 
          c.id, 
          c.amount, 
          c.status, 
          c.created_at, 
          c.due_date,
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
    const chargeParams = [user.company_id]

    // If manager, filter by their branch
    if (user.role === 'manager' && user.branch) {
      chargeQuery += ` AND u.branch = $2`
      chargeParams.push(user.branch)
    }

    chargeQuery += ` ORDER BY c.created_at DESC LIMIT 50` // Increased limit for filter utility

    const chargeResult = await db.query(chargeQuery, chargeParams)

    // 2. Get active branches for filtering
    let branchQuery = `
        SELECT DISTINCT branch 
        FROM users 
        WHERE company_id = $1 AND role = 'collector' AND branch IS NOT NULL AND branch != ''
    `
    const branchParams = [user.company_id]
    if (user.role === 'manager' && user.branch) {
      branchQuery += ` AND branch = $2`
      branchParams.push(user.branch)
    }
    const branchResult = await db.query(branchQuery, branchParams)
    const branches = branchResult.rows.map(r => r.branch)

    // 3. Get Branding
    const brandRes = await db.query("SELECT display_name FROM companies WHERE id = $1", [user.company_id])
    const companyName = brandRes.rows[0]?.display_name || "Cobrança em Campo"

    return {
      charges: chargeResult.rows,
      branches,
      companyName,
      error: null
    }
  } catch (error) {
    console.error("Dashboard SQL Error:", error)
    return { charges: [], branches: [], companyName: "", error: error instanceof Error ? error.message : String(error) }
  }
}

export default async function ManagerDashboardPage() {
  const user = await getCurrentUser()

  if (!user || !["manager", "company_admin"].includes(user.role)) {
    redirect("/signin")
  }

  const { charges, branches, companyName, error } = await getDashboardData(user)

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Painel de Cobranças</h1>
        <p className="text-muted-foreground">Acompanhamento em tempo real das cobranças geradas.</p>
      </div>

      <DashboardView
        initialCharges={charges}
        branches={branches}
        currentUserRole={user.role}
        companyName={companyName}
      />

      <div className="mt-12 mb-4 border-t pt-8">
        <DeveloperFooter />
      </div>
    </main>
  )
}
