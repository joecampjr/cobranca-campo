import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const user = await getCurrentUser()

        if (!user || user.role !== "company_admin") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const companyId = user.company_id

        // Fetch all relevant data for the company
        const [users, customers, charges, company] = await Promise.all([
            db.query("SELECT * FROM users WHERE company_id = $1", [companyId]),
            db.query("SELECT * FROM customers WHERE company_id = $1", [companyId]),
            db.query("SELECT * FROM charges WHERE company_id = $1", [companyId]),
            db.query("SELECT * FROM companies WHERE id = $1", [companyId])
        ])

        const backupData = {
            timestamp: new Date().toISOString(),
            company: company.rows[0],
            users: users.rows,
            customers: customers.rows,
            charges: charges.rows,
            stats: {
                usersCount: users.rowCount,
                customersCount: customers.rowCount,
                chargesCount: charges.rowCount
            }
        }

        const json = JSON.stringify(backupData, null, 2)
        const dateStr = new Date().toISOString().split('T')[0]
        const filename = `backup-${dateStr}.json`

        return new NextResponse(json, {
            headers: {
                "Content-Type": "application/json",
                "Content-Disposition": `attachment; filename="${filename}"`
            }
        })

    } catch (error) {
        console.error("Backup Error:", error)
        return new NextResponse("Backup Failed", { status: 500 })
    }
}
