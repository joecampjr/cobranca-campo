"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Phone, Mail, Navigation, CheckCircle2, Camera, DollarSign } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { use, useState } from "react"

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  // Mock data
  const customer = {
    id,
    name: "Ana Costa",
    document: "123.456.789-00",
    phone: "(11) 98765-4321",
    email: "ana@email.com",
    address: "Rua das Flores, 123 - São Paulo, SP",
    charges: [
      {
        id: "1",
        description: "Mensalidade Janeiro 2026",
        amount: 450.0,
        dueDate: "2026-01-15",
        status: "pending",
      },
    ],
  }

  const handleCollectPayment = () => {
    setShowPaymentForm(true)
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Mobile Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/collector">
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
          </Link>
          <h1 className="text-lg font-bold">Detalhes do Cliente</h1>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Customer Info */}
        <Card className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-semibold text-primary">{customer.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{customer.name}</h2>
              <p className="text-sm text-muted-foreground">{customer.document}</p>
            </div>
          </div>

          <div className="space-y-3">
            <a href={`tel:${customer.phone}`} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Phone className="h-5 w-5 text-primary" />
              <span className="font-medium">{customer.phone}</span>
            </a>
            <a href={`mailto:${customer.email}`} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
              <span className="font-medium">{customer.email}</span>
            </a>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="font-medium">{customer.address}</span>
            </div>
          </div>

          <Button className="w-full mt-4 bg-transparent" variant="outline">
            <Navigation className="h-4 w-4 mr-2" />
            Abrir no Google Maps
          </Button>
        </Card>

        {/* Charges */}
        <div>
          <h3 className="font-semibold mb-3">Cobranças Pendentes</h3>
          <div className="space-y-3">
            {customer.charges.map((charge) => (
              <Card key={charge.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold mb-1">{charge.description}</h4>
                    <p className="text-sm text-muted-foreground">
                      Vencimento: {new Date(charge.dueDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <Badge variant="secondary">Pendente</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    R$ {charge.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  <Button onClick={handleCollectPayment}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Receber
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        {showPaymentForm && (
          <Card className="p-4 border-primary">
            <h3 className="font-semibold mb-4">Registrar Pagamento</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Método de Pagamento</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-auto py-3 flex-col gap-2 bg-transparent">
                    <DollarSign className="h-5 w-5" />
                    <span className="text-xs">Dinheiro</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-3 flex-col gap-2 bg-transparent">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                    <span className="text-xs">PIX</span>
                  </Button>
                </div>
              </div>

              <Button className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Tirar Foto do Comprovante
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => setShowPaymentForm(false)}>
                  Cancelar
                </Button>
                <Link href="/collector">
                  <Button className="w-full">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Confirmar
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
