import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-accent/10 mb-6">
          <CheckCircle2 className="h-10 w-10 text-accent" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Pagamento Confirmado!</h1>
        <p className="text-muted-foreground mb-8">Seu pagamento foi processado com sucesso.</p>

        <div className="space-y-3">
          <Link href="/customer/portal">
            <Button className="w-full">Voltar ao Portal</Button>
          </Link>
          <Button variant="outline" className="w-full bg-transparent">
            Baixar Comprovante
          </Button>
        </div>
      </Card>
    </div>
  )
}
