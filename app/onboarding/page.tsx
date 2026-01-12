"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Loader2, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function OnboardingPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        companyName: "",
        document: "",
    })

    // Format CNPJ mask
    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "")
        if (value.length > 14) value = value.slice(0, 14)

        if (value.length > 12) {
            value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
        } else if (value.length > 8) {
            value = value.replace(/^(\d{2})(\d{3})(\d{3})/, "$1.$2.$3")
        } else if (value.length > 5) {
            value = value.replace(/^(\d{2})(\d{3})/, "$1.$2")
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})/, "$1.")
        }

        setFormData({ ...formData, document: value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: formData.companyName,
                    document: formData.document.replace(/\D/g, "")
                }),
            })

            if (!res.ok) throw new Error("Erro ao criar empresa")

            toast({
                title: "Tudo pronto!",
                description: "Empresa configurada com sucesso.",
            })

            // Redirect to Collector Flow as requested by user ("New Charge") or Manager Dashboard
            // For now, let's give them the choice or default to Manager
            router.push("/manager/dashboard")

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Não foi possível concluir o cadastro.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Configurar sua Empresa</CardTitle>
                    <CardDescription>
                        Para começar, precisamos de alguns dados da sua empresa ou negócio.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Nome da Empresa / Negócio</Label>
                            <Input
                                id="companyName"
                                placeholder="Ex: Cobranças Silva, Mercado X..."
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="document">CNPJ (Opcional)</Label>
                            <Input
                                id="document"
                                placeholder="00.000.000/0000-00"
                                value={formData.document}
                                onChange={handleDocumentChange}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading} size="lg">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                                <span className="flex items-center">
                                    Concluir e Acessar Painel <ArrowRight className="ml-2 h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
