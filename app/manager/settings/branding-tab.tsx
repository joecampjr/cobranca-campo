"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export function BrandingTab({ initialName, initialLogo }: { initialName?: string, initialLogo?: string }) {
    const [name, setName] = useState(initialName || "")
    const [logo, setLogo] = useState(initialLogo || "")
    const [loading, setLoading] = useState(false)

    async function save() {
        setLoading(true)
        try {
            const res = await fetch("/api/settings/branding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ displayName: name, logoUrl: logo })
            })
            if (res.ok) {
                toast.success("Personalização salva!")
                // Force reload to update sidebar instantly (could be optimized with Context but reload is safer for layout changes)
                window.location.reload()
            }
        } catch (e) {
            toast.error("Erro ao salvar")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Identidade Visual</CardTitle>
                <CardDescription>Personalize o nome e ícone da sua empresa no sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="displayName">Nome da Empresa (Exibição)</Label>
                    <Input
                        id="displayName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nome da sua marca"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="logoUrl">URL do Logo (Ícone)</Label>
                    <Input
                        id="logoUrl"
                        value={logo}
                        onChange={(e) => setLogo(e.target.value)}
                        placeholder="https://..."
                    />
                    <p className="text-xs text-muted-foreground">Cole o link direto da imagem do seu logo (quadrado recomendado).</p>
                </div>

                <Button onClick={save} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Alterações
                </Button>
            </CardContent>
        </Card>
    )
}
