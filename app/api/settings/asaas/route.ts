import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getUserFromSession } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("session_token")?.value

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await getUserFromSession(token)
        if (!user || user.role !== "company_admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const companyResult = await db.query(
            "SELECT asaas_api_key, asaas_wallet_id FROM companies WHERE id = $1",
            [user.company_id]
        )
        const company = companyResult.rows[0]

        // Return masked key for security
        const maskedKey = company?.asaas_api_key
            ? `${company.asaas_api_key.substring(0, 4)}...${company.asaas_api_key.substring(company.asaas_api_key.length - 4)}`
            : ""

        return NextResponse.json({
            apiKey: maskedKey,
            walletId: company?.asaas_wallet_id || "",
            webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cobranca-campo.vercel.app'}/api/webhooks/asaas`,
            isConfigured: !!company?.asaas_api_key
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("session_token")?.value

        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const user = await getUserFromSession(token)
        if (!user || user.role !== "company_admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { apiKey, walletId } = await req.json()

        // Only update if value is provided (ignore empty if just updating other fields, though here we update both)
        if (apiKey && !apiKey.includes("...")) {
            await db.query(
                "UPDATE companies SET asaas_api_key = $1 WHERE id = $2",
                [apiKey, user.company_id]
            )
        }

        if (walletId !== undefined) {
            await db.query(
                "UPDATE companies SET asaas_wallet_id = $1 WHERE id = $2",
                [walletId, user.company_id]
            )
        }

        return NextResponse.json({ success: true })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
