import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { db } from "@/lib/db"
import { formatCurrency } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts" // Might need client component for charts, but let's build table first or simple server component stats

async function getReportData(user: any) {
    let query = `
    SELECT 
        u.name as collector_name,
        COUNT(c.id) as total_charges,
        COALESCE(SUM(CASE WHEN c.status IN ('paid', 'received', 'confirmed') THEN c.amount ELSE 0 END), 0) as total_collected,
        COALESCE(SUM(CASE WHEN c.status IN ('pending', 'overdue') THEN c.amount ELSE 0 END), 0) as total_pending
    FROM users u
    LEFT JOIN charges c ON c.collector_id = u.id
    WHERE u.company_id = $1 AND u.role = 'collector'
  `
    const params = [user.company_id]

    if (user.role === 'manager' && user.branch) {
        query += ` AND u.branch = $2`
        params.push(user.branch)
    }

    query += ` GROUP BY u.name, u.id ORDER BY total_collected DESC`

    const result = await db.query(query, params)
    return result.rows
}

export default async function ReportsPage() {
    const user = await getCurrentUser()

    if (!user || !["manager", "company_admin"].includes(user.role)) {
        redirect("/signin")
    }

    const reports = await getReportData(user)

    const totalCollected = reports.reduce((acc, curr) => acc + Number(curr.total_collected), 0)
    const totalPending = reports.reduce((acc, curr) => acc + Number(curr.total_pending), 0)

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Relatórios {user.branch ? `- ${user.branch}` : ''}</h1>
                <p className="text-muted-foreground">Desempenho da equipe de cobrança.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Coletado</CardTitle>
                        <CardDescription>Valor recebido pela equipe nesta visão.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-green-600">
                            {formatCurrency(totalCollected)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Pendente</CardTitle>
                        <CardDescription>Valor em aberto a ser cobrado.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-yellow-600">
                            {formatCurrency(totalPending)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Desempenho por Cobrador</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {reports.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">Nenhum dado encontrado.</p>
                        ) : (
                            reports.map((rep, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="font-semibold text-lg">{rep.collector_name}</p>
                                        <p className="text-sm text-muted-foreground">{rep.total_charges} cobranças geradas</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="font-bold text-green-600">{formatCurrency(Number(rep.total_collected))}</p>
                                        <p className="text-sm text-yellow-600">Pendente: {formatCurrency(Number(rep.total_pending))}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}
