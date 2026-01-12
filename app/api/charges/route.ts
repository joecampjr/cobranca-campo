import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAsaasClient } from "@/lib/asaas"
import { getUserFromSession } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(req: Request) {
    try {
        // 1. Authenticate
        const cookieStore = await cookies()
        const token = cookieStore.get("session_token")?.value

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await getUserFromSession(token)
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // 2. Parse body
        const body = await req.json()
        const { cpf, name, amount, description } = body
        const paymentMethod = body.paymentMethod || "UNDEFINED"

        // 3. Setup Asaas
        // Fetch tenant settings
        const companyRes = await db.query("SELECT asaas_api_key FROM companies WHERE id = $1", [user.company_id])
        const companyApiKey = companyRes.rows[0]?.asaas_api_key

        const apiKey = companyApiKey || process.env.ASAAS_API_KEY
        if (!apiKey) {
            return NextResponse.json({ error: "Configuração de pagamento não encontrada. Contate o administrador." }, { status: 400 })
        }

        const asaas = getAsaasClient(apiKey)

        // 4. Find or Create Customer
        // Check local DB first
        let customerResult = await db.query("SELECT * FROM customers WHERE document = $1 AND company_id = $2", [cpf, user.company_id])
        let customer = customerResult.rows[0]
        let asaasCustomerId = customer?.asaas_customer_id

        if (!asaasCustomerId) {
            // Check if exists in Asaas first (to duplicate/error avoidance)
            try {
                const existingAsaasCustomer = await asaas.findCustomer(cpf)
                if (existingAsaasCustomer) {
                    asaasCustomerId = existingAsaasCustomer.id
                } else {
                    // Create in Asaas
                    const asaasCustomer = await asaas.createCustomer({
                        name,
                        cpfCnpj: cpf
                    })
                    asaasCustomerId = asaasCustomer.id
                }
            } catch (e) {
                console.error("Error managing Asaas customer", e)
                throw new Error("Erro ao comunicar com o Asaas para cadastro de cliente")
            }
        }

        // Upsert local customer record
        if (!customer) {
            const newCustomer = await db.query(
                `INSERT INTO customers (company_id, name, document, asaas_customer_id) 
                 VALUES ($1, $2, $3, $4) RETURNING id`,
                [user.company_id, name, cpf, asaasCustomerId]
            )
            customer = { id: newCustomer.rows[0].id }
        } else if (!customer.asaas_customer_id) {
            await db.query("UPDATE customers SET asaas_customer_id = $1 WHERE id = $2", [asaasCustomerId, customer.id])
        }

        // 5. Create Payment in Asaas
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + 3) // Default due date 3 days from now

        const asaasPayment = await asaas.createPayment({
            customer: asaasCustomerId,
            billingType: paymentMethod,
            value: amount,
            dueDate: dueDate.toISOString().split('T')[0],
            description,
            externalReference: description
        })

        // 6. If PIX, get QR Code
        let pixQrCode = null
        let pixCode = null

        if (paymentMethod === "PIX") {
            try {
                const qrResult = await asaas.getPixQrCode(asaasPayment.id)
                pixQrCode = qrResult.encodedImage
                pixCode = qrResult.payload
            } catch (e) {
                console.warn("Could not fetch PIX QR", e)
            }
        }

        // 7. Save Charge to DB
        // Using "PENDING" (uppercase) to match Asaas status convention
        await db.query(
            `INSERT INTO charges 
        (company_id, customer_id, collector_id, description, amount, due_date, payment_method, 
         status, asaas_payment_id, asaas_invoice_url, asaas_pix_code, asaas_pix_qr_code_url, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())`,
            [
                user.company_id,
                customer.id,
                user.id,
                description,
                amount,
                dueDate,
                paymentMethod,
                "PENDING",
                asaasPayment.id,
                asaasPayment.bankSlipUrl || asaasPayment.invoiceUrl, // Use invoice URL as fallback
                pixCode,
                null // We verify base64 image on frontend, normally wouldn't save base64 to DB URL column
            ]
        )

        return NextResponse.json({
            success: true,
            paymentId: asaasPayment.id,
            invoiceUrl: asaasPayment.invoiceUrl,
            pixQrCode, // Base64
            pixCode,
            amount
        })

    } catch (error: any) {
        console.error("Charge creation error:", error)
        return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 })
    }
}
