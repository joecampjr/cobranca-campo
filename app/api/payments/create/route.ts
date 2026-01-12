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

    const { chargeId, billingType, installments } = await request.json()

    // Get charge details
    const chargeResult = await db.query(
      `SELECT c.*, cu.name as customer_name, cu.document, cu.email, cu.phone, 
              co.asaas_api_key, cu.asaas_customer_id
       FROM charges c
       JOIN customers cu ON c.customer_id = cu.id
       JOIN companies co ON c.company_id = co.id
       WHERE c.id = $1`,
      [chargeId],
    )

    const charge = chargeResult.rows[0]
    if (!charge) {
      return NextResponse.json({ error: "Charge not found" }, { status: 404 })
    }

    const asaas = getAsaasClient(charge.asaas_api_key)

    // Create or get Asaas customer
    let asaasCustomerId = charge.asaas_customer_id

    if (!asaasCustomerId) {
      const asaasCustomer = await asaas.createCustomer({
        name: charge.customer_name,
        cpfCnpj: charge.document,
        email: charge.email,
        phone: charge.phone,
      })
      asaasCustomerId = asaasCustomer.id

      // Update customer with Asaas ID
      await db.query("UPDATE customers SET asaas_customer_id = $1 WHERE id = $2", [asaasCustomerId, charge.customer_id])
    }

    // Create payment in Asaas
    const payment = await asaas.createPayment({
      customer: asaasCustomerId,
      billingType: billingType,
      value: charge.amount,
      dueDate: charge.due_date,
      description: charge.description,
      externalReference: chargeId,
      installmentCount: installments || 1,
    })

    // Update charge with Asaas payment info
    await db.query(
      `UPDATE charges 
       SET asaas_payment_id = $1, 
           asaas_invoice_url = $2,
           asaas_boleto_url = $3,
           payment_method = $4,
           installments = $5,
           updated_at = NOW()
       WHERE id = $6`,
      [payment.id, payment.invoiceUrl, payment.bankSlipUrl, billingType.toLowerCase(), installments || 1, chargeId],
    )

    // Get PIX info if needed
    let pixData = null
    if (billingType === "PIX") {
      const pixQrCode = await asaas.getPixQrCode(payment.id)
      pixData = {
        qrCodeImage: pixQrCode.encodedImage,
        qrCodePayload: pixQrCode.payload,
        expirationDate: pixQrCode.expirationDate,
      }

      // Update charge with PIX info
      await db.query(
        `UPDATE charges 
         SET asaas_pix_code = $1,
             asaas_pix_qr_code_url = $2
         WHERE id = $3`,
        [pixQrCode.payload, pixQrCode.encodedImage, chargeId],
      )
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        invoiceUrl: payment.invoiceUrl,
        bankSlipUrl: payment.bankSlipUrl,
        pixData,
      },
    })
  } catch (error: any) {
    console.error("Payment creation error:", error)
    return NextResponse.json({ error: error.message || "Failed to create payment" }, { status: 500 })
  }
}
