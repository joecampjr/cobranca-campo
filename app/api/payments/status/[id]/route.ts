import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getAsaasClient } from "@/lib/asaas"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get charge with Asaas payment ID
    const result = await db.query(
      `SELECT c.*, co.asaas_api_key
       FROM charges c
       JOIN companies co ON c.company_id = co.id
       WHERE c.id = $1`,
      [id],
    )

    const charge = result.rows[0]
    if (!charge) {
      return NextResponse.json({ error: "Charge not found" }, { status: 404 })
    }

    if (!charge.asaas_payment_id) {
      return NextResponse.json({ status: charge.status })
    }

    // Get payment status from Asaas
    const asaas = getAsaasClient(charge.asaas_api_key)
    const payment = await asaas.getPayment(charge.asaas_payment_id)

    // Update local status if changed
    if (payment.status !== charge.status) {
      await db.query(`UPDATE charges SET status = $1, updated_at = NOW() WHERE id = $2`, [
        payment.status.toLowerCase(),
        id,
      ])
    }

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      value: payment.value,
      dueDate: payment.dueDate,
      invoiceUrl: payment.invoiceUrl,
      bankSlipUrl: payment.bankSlipUrl,
    })
  } catch (error: any) {
    console.error("Payment status error:", error)
    return NextResponse.json({ error: "Failed to get payment status" }, { status: 500 })
  }
}
