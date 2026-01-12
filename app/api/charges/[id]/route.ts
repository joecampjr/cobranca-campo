import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const user = await getCurrentUser()

        if (!user || !["manager", "company_admin"].includes(user.role)) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const chargeId = params.id

        // Fetch charge details to check ownership/permissions and get asaas_id
        const chargeResult = await db.query(`
            SELECT c.*, u.branch as collector_branch 
            FROM charges c
            LEFT JOIN users u ON c.collector_id = u.id
            WHERE c.id = $1 AND c.company_id = $2
        `, [chargeId, user.company_id])

        if (chargeResult.rows.length === 0) {
            return new NextResponse(`Charge with ID ${chargeId} not found in DB`, { status: 404 })
        }

        const charge = chargeResult.rows[0]

        // Manager Scope Check
        if (user.role === 'manager' && user.branch && charge.collector_branch !== user.branch) {
            return new NextResponse("Unauthorized for this branch", { status: 403 })
        }

        // Get Asaas API Key
        const companyRes = await db.query("SELECT asaas_api_key FROM companies WHERE id = $1", [user.company_id])
        const apiKey = companyRes.rows[0]?.asaas_api_key || process.env.ASAAS_API_KEY

        if (!apiKey) {
            return new NextResponse("Asaas API Key not found for this company", { status: 500 })
        }

        // Delete in Asaas
        if (charge.asaas_payment_id) {
            const asaasResponse = await fetch(`https://www.asaas.com/api/v3/payments/${charge.asaas_payment_id}`, {
                method: "DELETE",
                headers: {
                    "access_token": apiKey
                }
            })

            if (!asaasResponse.ok) {
                if (asaasResponse.status === 404) {
                    // Already deleted in Asaas, proceed to delete local
                    console.log("Charge already deleted in Asaas")
                } else {
                    const errorJson = await asaasResponse.json().catch(() => null)
                    const errorText = errorJson?.errors?.[0]?.description || await asaasResponse.text() || "Erro desconhecido no Asaas"

                    console.error("Asaas Delete Error:", errorText)
                    return new NextResponse(`Asaas Error: ${errorText}`, { status: 502 })
                }
            }
        }

        // Delete locally
        await db.query("DELETE FROM charges WHERE id = $1", [chargeId])

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error("[CHARGE_DELETE]", error)
        return new NextResponse("Internal Error: " + (error instanceof Error ? error.message : String(error)), { status: 500 })
    }
}
