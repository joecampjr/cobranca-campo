import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAsaasClient, type AsaasWebhookEvent } from "@/lib/asaas"

export async function POST(request: NextRequest) {
  try {
    const asaas = getAsaasClient()
    if (!asaas.validateWebhook(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const event: AsaasWebhookEvent = await request.json()

    // Log webhook for debugging
    await db.query(
      `INSERT INTO webhook_logs (event_type, payload, created_at)
       VALUES ($1, $2, NOW())`,
      [event.event, JSON.stringify(event)],
    )

    // Handle different event types
    switch (event.event) {
      case "PAYMENT_CONFIRMED":
      case "PAYMENT_RECEIVED":
        await handlePaymentConfirmed(event)
        break

      case "PAYMENT_OVERDUE":
        await handlePaymentOverdue(event)
        break

      case "PAYMENT_REFUNDED":
        await handlePaymentRefunded(event)
        break

      case "PAYMENT_DELETED":
        await handlePaymentDeleted(event)
        break

      default:
        console.log(`Unhandled webhook event: ${event.event}`)
    }

    // Mark webhook as processed
    await db.query(
      `UPDATE webhook_logs 
       SET processed = true, processed_at = NOW()
       WHERE event_type = $1 AND payload->>'payment'->>'id' = $2`,
      [event.event, event.payment.id],
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Webhook processing error:", error)

    // Log error
    await db.query(
      `UPDATE webhook_logs 
       SET error_message = $1
       WHERE event_type = $2`,
      [error.message, "ERROR"],
    )

    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handlePaymentConfirmed(event: AsaasWebhookEvent) {
  const { payment } = event

  // Update charge status
  await db.query(
    `UPDATE charges 
     SET status = 'received',
         paid_at = $1,
         paid_amount = $2,
         updated_at = NOW()
     WHERE asaas_payment_id = $3`,
    [payment.paymentDate || payment.confirmedDate, payment.value, payment.id],
  )

  // Get charge and collector info
  const result = await db.query(
    `SELECT c.*, co.id as collector_id, co.commission_percentage
     FROM charges c
     LEFT JOIN users co ON c.collector_id = co.id
     WHERE c.asaas_payment_id = $1`,
    [payment.id],
  )

  const charge = result.rows[0]

  // Create notification for company admin
  await db.query(
    `INSERT INTO notifications (user_id, title, message, type, created_at)
     SELECT u.id, 'Pagamento Recebido', $1, 'payment', NOW()
     FROM users u
     WHERE u.company_id = $2 AND u.role IN ('company_admin', 'manager')`,
    [`Cobrança de R$ ${payment.value} foi paga.`, charge.company_id],
  )

  // Update daily summary
  const paymentDateStr = payment.paymentDate || payment.confirmedDate || new Date().toISOString()
  const date = new Date(paymentDateStr).toISOString().split("T")[0]
  if (charge.collector_id) {
    await db.query(
      `INSERT INTO daily_summaries (company_id, collector_id, date, charges_collected, collected_amount, commission_earned)
       VALUES ($1, $2, $3, 1, $4, $5)
       ON CONFLICT (company_id, collector_id, date) 
       DO UPDATE SET 
         charges_collected = daily_summaries.charges_collected + 1,
         collected_amount = daily_summaries.collected_amount + $4,
         commission_earned = daily_summaries.commission_earned + $5`,
      [
        charge.company_id,
        charge.collector_id,
        date,
        payment.value,
        payment.value * (charge.commission_percentage / 100),
      ],
    )
  }
}

async function handlePaymentOverdue(event: AsaasWebhookEvent) {
  const { payment } = event

  await db.query(
    `UPDATE charges 
     SET status = 'overdue',
         updated_at = NOW()
     WHERE asaas_payment_id = $1`,
    [payment.id],
  )

  // Notify managers
  const result = await db.query(`SELECT company_id FROM charges WHERE asaas_payment_id = $1`, [payment.id])

  if (result.rows[0]) {
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type, created_at)
       SELECT u.id, 'Cobrança Vencida', $1, 'alert', NOW()
       FROM users u
       WHERE u.company_id = $2 AND u.role IN ('company_admin', 'manager')`,
      [`Cobrança de R$ ${payment.value} está vencida.`, result.rows[0].company_id],
    )
  }
}

async function handlePaymentRefunded(event: AsaasWebhookEvent) {
  const { payment } = event

  await db.query(
    `UPDATE charges 
     SET status = 'cancelled',
         updated_at = NOW()
     WHERE asaas_payment_id = $1`,
    [payment.id],
  )
}

async function handlePaymentDeleted(event: AsaasWebhookEvent) {
  const { payment } = event

  await db.query(
    `DELETE FROM charges WHERE asaas_payment_id = $1`,
    [payment.id],
  )
}
