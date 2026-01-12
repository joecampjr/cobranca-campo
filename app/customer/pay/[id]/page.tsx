"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Copy, QrCode, Barcode, CreditCard, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { use, useState } from "react"
import { Badge } from "@/components/ui/badge"

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [paymentGenerated, setPaymentGenerated] = useState(false)

  // Mock data
  const charge = {
    id,
    description: "Mensalidade Janeiro 2026",
    amount: 450.0,
    dueDate: "2026-01-15",
    customerName: "João Silva",
    companyName: "Empresa XYZ Ltda",
  }

  // Mock PIX data (would come from Asaas)
  const pixData = {
    qrCode: "00020126580014br.gov.bcb.pix...",
    expiresIn: "30 minutos",
  }

  const handleGeneratePayment = (method: string) => {
    setSelectedMethod(method)
    setPaymentGenerated(true)
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/customer/portal">
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
            <h1 className="text-xl font-bold">Realizar Pagamento</h1>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-8">
        {/* Charge Details */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{charge.description}</h2>
              <p className="text-sm text-muted-foreground">{charge.companyName}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Valor</p>
              <p className="text-2xl font-bold">
                R$ {charge.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Vencimento</p>
              <p className="text-lg font-semibold">{new Date(charge.dueDate).toLocaleDateString("pt-BR")}</p>
            </div>
          </div>
        </Card>

        {!paymentGenerated ? (
          <>
            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Escolha a forma de pagamento</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Card
                  className="p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                  onClick={() => handleGeneratePayment("pix")}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <QrCode className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">PIX</h4>
                      <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
                      <Badge className="mt-2">Recomendado</Badge>
                    </div>
                  </div>
                </Card>

                <Card
                  className="p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                  onClick={() => handleGeneratePayment("boleto")}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Barcode className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Boleto</h4>
                      <p className="text-sm text-muted-foreground">Vence em 3 dias úteis</p>
                    </div>
                  </div>
                </Card>

                <Card
                  className="p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                  onClick={() => handleGeneratePayment("credit_card")}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Cartão de Crédito</h4>
                      <p className="text-sm text-muted-foreground">Parcele em até 3x</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* PIX Payment */}
            {selectedMethod === "pix" && (
              <Card className="p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                    <QrCode className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Pagar com PIX</h3>
                  <p className="text-sm text-muted-foreground">Escaneie o QR Code ou copie o código PIX</p>
                </div>

                {/* QR Code Placeholder */}
                <div className="bg-muted rounded-lg p-8 flex items-center justify-center mb-6">
                  <div className="h-64 w-64 bg-card rounded-lg border-2 border-dashed flex items-center justify-center">
                    <QrCode className="h-32 w-32 text-muted-foreground" />
                  </div>
                </div>

                {/* PIX Code */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">Código PIX Copia e Cola</p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-muted rounded-lg p-3 font-mono text-sm break-all">{pixData.qrCode}</div>
                    <Button size="icon" className="flex-shrink-0">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Código expira em {pixData.expiresIn}</p>
                </div>

                {/* Instructions */}
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Como pagar:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Abra o app do seu banco</li>
                    <li>Escolha a opção PIX</li>
                    <li>Escaneie o QR Code ou cole o código</li>
                    <li>Confirme o pagamento</li>
                  </ol>
                </div>

                <div className="flex items-center gap-2 text-sm text-accent">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Confirmação automática após pagamento</span>
                </div>
              </Card>
            )}

            {/* Boleto Payment */}
            {selectedMethod === "boleto" && (
              <Card className="p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                    <Barcode className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Boleto Gerado</h3>
                  <p className="text-sm text-muted-foreground">Pague em qualquer banco ou lotérica</p>
                </div>

                <div className="space-y-4 mb-6">
                  <Button className="w-full" size="lg">
                    <FileText className="h-5 w-5 mr-2" />
                    Baixar Boleto PDF
                  </Button>

                  <div>
                    <p className="text-sm font-medium mb-2">Código de Barras</p>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-muted rounded-lg p-3 font-mono text-sm">
                        23793.38128 60047.101241 56789.101230 1 99990000045000
                      </div>
                      <Button size="icon" className="flex-shrink-0">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-500">
                    Atenção: O boleto vence em 3 dias úteis
                  </p>
                </div>
              </Card>
            )}

            {/* Credit Card Payment */}
            {selectedMethod === "credit_card" && (
              <Card className="p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Pagar com Cartão</h3>
                  <p className="text-sm text-muted-foreground">Parcele em até 3x sem juros</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Número do Cartão</label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-4 py-3 rounded-lg border bg-background"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Validade</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="w-full px-4 py-3 rounded-lg border bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 rounded-lg border bg-background"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Nome no Cartão</label>
                    <input
                      type="text"
                      placeholder="Como está no cartão"
                      className="w-full px-4 py-3 rounded-lg border bg-background"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Parcelas</label>
                    <select className="w-full px-4 py-3 rounded-lg border bg-background">
                      <option>1x de R$ 450,00 sem juros</option>
                      <option>2x de R$ 225,00 sem juros</option>
                      <option>3x de R$ 150,00 sem juros</option>
                    </select>
                  </div>

                  <Button className="w-full" size="lg">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Finalizar Pagamento
                  </Button>
                </div>
              </Card>
            )}

            <div className="flex justify-center mt-6">
              <Button variant="ghost" onClick={() => setPaymentGenerated(false)}>
                Escolher outra forma de pagamento
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
