// Asaas Payment Gateway Integration
// Documentation: https://docs.asaas.com/

interface AsaasConfig {
  apiKey: string
  environment: "production" | "sandbox"
}

interface AsaasCustomer {
  id: string
  name: string
  cpfCnpj: string
  email?: string
  phone?: string
  mobilePhone?: string
  address?: string
  addressNumber?: string
  complement?: string
  province?: string
  postalCode?: string
  deleted?: boolean
}

interface AsaasPayment {
  id: string
  customer: string
  billingType: "BOLETO" | "CREDIT_CARD" | "PIX" | "UNDEFINED"
  value: number
  dueDate: string
  description?: string
  externalReference?: string
  installmentCount?: number
  invoiceUrl?: string
  bankSlipUrl?: string
  pixQrCode?: string
  pixCopyPasteCode?: string
  status: "PENDING" | "RECEIVED" | "CONFIRMED" | "OVERDUE" | "REFUNDED" | "CANCELLED"
}

interface AsaasWebhookEvent {
  event:
  | "PAYMENT_CREATED"
  | "PAYMENT_UPDATED"
  | "PAYMENT_CONFIRMED"
  | "PAYMENT_RECEIVED"
  | "PAYMENT_OVERDUE"
  | "PAYMENT_DELETED"
  | "PAYMENT_RESTORED"
  | "PAYMENT_REFUNDED"
  payment: {
    id: string
    customer: string
    value: number
    netValue: number
    dueDate: string
    originalDueDate: string
    description?: string
    billingType: string
    status: string
    confirmedDate?: string
    paymentDate?: string
  }
}

class AsaasClient {
  private apiKey: string
  private baseUrl: string

  constructor(config: AsaasConfig) {
    this.apiKey = config.apiKey
    this.baseUrl =
      config.environment === "production" ? "https://www.asaas.com/api/v3" : "https://sandbox.asaas.com/api/v3"
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        access_token: this.apiKey,
        ...options.headers,
      },
    })

    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        // Asaas format: { errors: [{ code: '...', description: '...' }] }
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorMessage = errorData.errors[0].description;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // response was not json
      }

      throw new Error(`Asaas API Error: ${errorMessage}`)
    }

    return response.json()
  }

  // Customer Management
  async createCustomer(data: {
    name: string
    cpfCnpj: string
    email?: string
    phone?: string
    mobilePhone?: string
    address?: string
    addressNumber?: string
    complement?: string
    province?: string
    postalCode?: string
  }): Promise<AsaasCustomer> {
    return this.request<AsaasCustomer>("/customers", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getCustomer(customerId: string): Promise<AsaasCustomer> {
    return this.request<AsaasCustomer>(`/customers/${customerId}`)
  }

  async updateCustomer(customerId: string, data: Partial<AsaasCustomer>): Promise<AsaasCustomer> {
    return this.request<AsaasCustomer>(`/customers/${customerId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async findCustomer(cpfCnpj: string): Promise<AsaasCustomer | null> {
    const response = await this.request<{ data: AsaasCustomer[] }>(`/customers?cpfCnpj=${cpfCnpj}&limit=1`)
    return response.data[0] || null
  }

  async restoreCustomer(customerId: string): Promise<AsaasCustomer> {
    return this.request<AsaasCustomer>(`/customers/${customerId}/restore`, {
      method: "POST"
    })
  }

  // Payment Management
  async createPayment(data: {
    customer: string
    billingType: "BOLETO" | "CREDIT_CARD" | "PIX" | "UNDEFINED"
    value: number
    dueDate: string
    description?: string
    externalReference?: string
    installmentCount?: number
    installmentValue?: number
    discount?: {
      value?: number
      dueDateLimitDays?: number
      type?: "FIXED" | "PERCENTAGE"
    }
    interest?: {
      value: number
    }
    fine?: {
      value: number
    }
  }): Promise<AsaasPayment> {
    return this.request<AsaasPayment>("/payments", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getPayment(paymentId: string): Promise<AsaasPayment> {
    return this.request<AsaasPayment>(`/payments/${paymentId}`)
  }

  async cancelPayment(paymentId: string): Promise<AsaasPayment> {
    return this.request<AsaasPayment>(`/payments/${paymentId}`, {
      method: "DELETE",
    })
  }

  async refundPayment(paymentId: string, value?: number): Promise<AsaasPayment> {
    return this.request<AsaasPayment>(`/payments/${paymentId}/refund`, {
      method: "POST",
      body: JSON.stringify({ value }),
    })
  }

  // PIX
  async getPixQrCode(paymentId: string): Promise<{ encodedImage: string; payload: string; expirationDate: string }> {
    return this.request(`/payments/${paymentId}/pixQrCode`)
  }

  // Credit Card
  async payWithCreditCard(
    paymentId: string,
    data: {
      creditCard: {
        holderName: string
        number: string
        expiryMonth: string
        expiryYear: string
        ccv: string
      }
      creditCardHolderInfo: {
        name: string
        email: string
        cpfCnpj: string
        postalCode: string
        addressNumber: string
        phone: string
      }
    },
  ): Promise<AsaasPayment> {
    return this.request<AsaasPayment>(`/payments/${paymentId}/payWithCreditCard`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Webhook validation
  validateWebhook(payload: string, signature: string, secret: string): boolean {
    // Implement webhook signature validation
    // This is a simplified version - implement proper HMAC validation in production
    return true
  }
}

// Singleton instance
let asaasClient: AsaasClient | null = null

export function getAsaasClient(companyApiKey?: string): AsaasClient {
  const apiKey = companyApiKey || process.env.ASAAS_API_KEY
  const environment = (process.env.ASAAS_ENVIRONMENT as "production" | "sandbox") || "sandbox"

  if (!apiKey) {
    throw new Error("Asaas API key not configured")
  }

  if (!asaasClient || companyApiKey) {
    asaasClient = new AsaasClient({ apiKey, environment })
  }

  return asaasClient
}

export type { AsaasCustomer, AsaasPayment, AsaasWebhookEvent }
