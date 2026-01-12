import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getUserFromSession, getSession } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("session_token")?.value

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await getUserFromSession(token)
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { companyName, document } = await req.json()

        if (!companyName) {
            return NextResponse.json({ error: "Nome da empresa é obrigatório" }, { status: 400 })
        }

        // 1. Create Company
        const companyResult = await db.query(
            `INSERT INTO companies (name, document, email) 
         VALUES ($1, $2, $3) 
         RETURNING id`,
            [companyName, document, user.email]
        )
        const companyId = companyResult.rows[0].id

        // 2. Update User (link to company and make admin)
        await db.query(
            `UPDATE users 
         SET company_id = $1, role = 'company_admin' 
         WHERE id = $2`,
            [companyId, user.id]
        )

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error("Onboarding error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
