"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Copy, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AsaasSettingsPage() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [formData, setFormData] = useState({
        apiKey: "",
        walletId: "",
        webhookUrl: "",
        isConfigured: false
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings/asaas")
            if (res.ok) {
                const data = await res.json()
                setFormData({
                    apiKey: data.apiKey, // Masked
                    walletId: data.walletId,
                    webhookUrl: data.webhookUrl,
                    isConfigured: data.isConfigured
                })
            }
        } catch (error) {
            console.error(error)
        } finally {
            setFetching(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/settings/asaas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    apiKey: formData.apiKey,
                    walletId: formData.walletId
                }),
            })

            if (!res.ok) throw new Error("Erro ao salvar configurações")

            toast({
                title: "Sucesso!",
                description: "Configurações do Asaas salvas com sucesso.",
            })

            fetchSettings() // Refresh to get updated state

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Não foi possível salvar as configurações.",
            })
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(formData.webhookUrl)
        toast({ title: "Webhook URL copiada!" })
    }

    if (fetching) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/manager/dashboard">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Integração Asaas</h1>
                    <p className="text-muted-foreground">Configure sua conexão com o gateway de pagamento.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Credenciais de API</CardTitle>
                        <CardDescription>
                            Insira sua chave de API do Asaas (Produção ou Sandbox).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="apiKey">Chave de API (API Key)</Label>
                                <div className="relative">
                                    <Input
                                        id="apiKey"
                                        type="password"
                                        placeholder="sk_..."
                                        value={formData.apiKey}
                                        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                                    />
                                    {formData.isConfigured && (
                                        <CheckCircle className="absolute right-3 top-2.5 h-4 w-4 text-green-500" />
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Encontrada em: Configurações do Conta {'>'} Integrações
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="walletId">ID da Carteira (Wallet ID)</Label>
                                <Input
                                    id="walletId"
                                    placeholder="Opcional"
                                    value={formData.walletId}
                                    onChange={(e) => setFormData({ ...formData, walletId: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Use apenas se você tiver múltiplas carteiras/subcontas.
                                </p>
                            </div>

                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Configurações
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Configuração de Webhook</CardTitle>
                        <CardDescription>
                            Configure esta URL no painel do Asaas para receber atualizações automáticas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg border space-y-2">
                            <Label className="text-xs font-semibold uppercase text-muted-foreground">URL do Webhook</Label>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 text-sm bg-background p-2 rounded border break-all">
                                    {formData.webhookUrl}
                                </code>
                                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900">
                            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                            <div className="space-y-1">
                                <p className="font-medium text-sm text-yellow-800 dark:text-yellow-400">Importante</p>
                                <p className="text-xs text-yellow-700 dark:text-yellow-500">
                                    No painel do Asaas, ative os eventos:
                                    <span className="font-mono ml-1">COBRANÇA (Criada, Recebida, Confirmada)</span>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
