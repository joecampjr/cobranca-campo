"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Copy, Share2, CheckCircle2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"

const formSchema = z.object({
    cpf: z.string().min(11, "CPF inválido").max(14),
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    amount: z.string().min(1, "Valor é obrigatório"),
    description: z.string().min(3, "Descrição necessária"),
    paymentMethod: z.string().default("UNDEFINED"),
})

export default function NewChargePage() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [successData, setSuccessData] = useState<any>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cpf: "",
            name: "",
            amount: "",
            description: "",
            paymentMethod: "UNDEFINED",
        },
    })

    // Format CPF mask
    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "")
        if (value.length > 11) value = value.slice(0, 11) // Limit to 11 digits for simple CPF

        // Simple mask 000.000.000-00
        if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
        } else if (value.length > 6) {
            value = value.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3")
        } else if (value.length > 3) {
            value = value.replace(/(\d{3})(\d+)/, "$1.$2")
        }

        form.setValue("cpf", value)
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            // Remove symbols from amount for API (R$ 1.000,00 -> 1000.00)
            const numericAmount = parseFloat(values.amount.replace(/[^0-9,]/g, "").replace(",", "."))

            const response = await fetch("/api/charges", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...values,
                    amount: numericAmount,
                    cpf: values.cpf.replace(/\D/g, "") // Send clean CPF
                }),
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Erro ao gerar cobrança")

            setSuccessData(data)
            toast({
                title: "Cobrança gerada!",
                description: "O cliente já pode realizar o pagamento.",
            })

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro",
                description: error.message,
            })
        } finally {
            setLoading(false)
        }
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text)
        toast({ title: "Copiado para área de transferência" })
    }

    function shareLink(url: string) {
        if (navigator.share) {
            navigator.share({
                title: 'Link de Pagamento',
                text: 'Olá, segue o link para pagamento:',
                url: url,
            }).catch(console.error);
        } else {
            copyToClipboard(url)
        }
    }

    const resetForm = () => {
        setSuccessData(null)
        form.reset()
    }

    if (successData) {
        return (
            <div className="p-4 max-w-md mx-auto space-y-4">
                <Card className="border-green-500 bg-green-50/10 dark:bg-green-900/10">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-2">
                            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-xl text-green-700 dark:text-green-400">Cobrança Gerada!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Valor a pagar</p>
                            <p className="text-3xl font-bold">{formatCurrency(successData.amount)}</p>
                        </div>

                        {successData.pixQrCode && (
                            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border">
                                <img
                                    src={`data:image/png;base64,${successData.pixQrCode}`}
                                    alt="QR Code PIX"
                                    className="w-48 h-48"
                                />
                                <p className="text-xs text-muted-foreground mt-2">Escaneie para pagar</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            {successData.pixCode && (
                                <Button variant="outline" className="w-full h-auto py-3 flex flex-col gap-1" onClick={() => copyToClipboard(successData.pixCode)}>
                                    <span className="flex items-center gap-2 font-semibold"><Copy className="h-4 w-4" /> Copiar Código PIX</span>
                                    <span className="text-xs text-muted-foreground truncate w-full px-4">{successData.pixCode}</span>
                                </Button>
                            )}

                            <Button className="w-full" onClick={() => shareLink(successData.invoiceUrl)}>
                                <Share2 className="mr-2 h-4 w-4" /> Compartilhar Link
                            </Button>

                            <Button variant="ghost" className="w-full" onClick={resetForm}>
                                Nova Cobrança
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Nova Cobrança</h1>
                <p className="text-muted-foreground">Preencha os dados do cliente</p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            <FormField
                                control={form.control}
                                name="cpf"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CPF do Cliente</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="000.000.000-00"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    handleCpfChange(e);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome do Cliente</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome completo" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 gap-4">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Valor (R$)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="0,00" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição / Referência</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Parcela 1/3 - Serviço XYZ" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Gerar Cobrança"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
