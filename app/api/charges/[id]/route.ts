import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { getAsaasClient } from "@/lib/asaas"
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
        const { searchParams } = new URL(req.url)
        const force = searchParams.get("force") === "true"

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
            if (force) {
                console.warn(`[Force Delete] Skipping Asaas check due to missing API Key for charge ${chargeId}`)
            } else {
                return new NextResponse("Asaas API Key not found for this company", { status: 500 })
            }
        } else {
            // Delete in Asaas
            if (charge.asaas_payment_id) {
                const asaas = getAsaasClient(apiKey)

                try {
                    await asaas.cancelPayment(charge.asaas_payment_id)
                } catch (error: any) {
                    const errorText = error.message
                    console.error("Asaas Delete Error:", errorText)

                    const lowerError = errorText.toLowerCase()
                    if (lowerError.includes("not found") || lowerError.includes("encontrada") || lowerError.includes("deleted") || lowerError.includes("removida")) {
                        console.log("Charge considered deleted/not found in Asaas based on error message. Proceeding.")
                    } else {
                        if (!force) {
                            return new NextResponse(`Asaas Error: ${errorText}`, { status: 502 })
                        }
                        console.warn(`[Force Delete] Ignoring Asaas error for charge ${chargeId}: ${errorText}`)
                    }
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
