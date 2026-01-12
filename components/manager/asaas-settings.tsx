"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Key } from "lucide-react"
import { toast } from "sonner"

export function AsaasSettings({ initialApiKey }: { initialApiKey?: string }) {
    const [apiKey, setApiKey] = useState(initialApiKey || "")
    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch("/api/settings/asaas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ apiKey }),
            })

            if (!response.ok) {
                throw new Error("Falha ao salvar")
            }

            toast.success("Chave da API salva com sucesso!")
        } catch (error) {
            toast.error("Erro ao salvar configurações")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Configuração do Asaas</CardTitle>
                <CardDescription>
                    Gerencie sua chave de API para integração com o gateway de pagamentos.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="apiKey">Chave de API (Sandbox ou Produção)</Label>
                        <div className="relative">
                            <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="apiKey"
                                name="apiKey"
                                placeholder="$aact_..."
                                className="pl-9"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                required
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Você pode encontrar esta chave no painel do Asaas em Configurações &gt; Integrações.
                        </p>
                    </div>

                </div>

                <div className="space-y-2">
                    <Label>URL do Webhook (Para notificações de pagamento)</Label>
                    <div className="flex gap-2">
                        <Input
                            readOnly
                            value="https://cobranca-campo.vercel.app/api/webhooks/asaas"
                            className="bg-muted"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                navigator.clipboard.writeText("https://cobranca-campo.vercel.app/api/webhooks/asaas")
                                toast.success("URL copiada!")
                            }}
                        >
                            Copiar
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Configure esta URL no Asaas para que o sistema receba confirmações de pagamento automaticamente.
                    </p>
                </div>

                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Configurações
                </Button>
            </form>
        </CardContent>
        </Card >
    )
}
