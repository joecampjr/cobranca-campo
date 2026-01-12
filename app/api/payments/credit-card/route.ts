import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getAsaasClient } from "@/lib/asaas"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { paymentId, creditCard, holderInfo } = await request.json()

    // Get payment details
    const chargeResult = await db.query(
      `SELECT c.*, co.asaas_api_key
       FROM charges c
       JOIN companies co ON c.company_id = co.id
       WHERE c.asaas_payment_id = $1`,
      [paymentId],
    )

    const charge = chargeResult.rows[0]
    if (!charge) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    const asaas = getAsaasClient(charge.asaas_api_key)

    // Process credit card payment
    const payment = await asaas.payWithCreditCard(paymentId, {
      creditCard: {
        holderName: creditCard.holderName,
        number: creditCard.number,
        expiryMonth: creditCard.expiryMonth,
        expiryYear: creditCard.expiryYear,
        ccv: creditCard.ccv,
      },
      creditCardHolderInfo: holderInfo,
    })

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
      },
    })
  } catch (error: any) {
    console.error("Credit card payment error:", error)
    return NextResponse.json({ error: error.message || "Failed to process payment" }, { status: 500 })
  }
}
