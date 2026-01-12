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
                    <Label htmlFor="logoUpload">Logo (Ícone)</Label>
                    <div className="flex gap-4 items-center">
                        {logo && (
                            <img src={logo} alt="Preview" className="h-12 w-12 rounded-lg object-contain bg-muted border" />
                        )}
                        <Input
                            id="logoUpload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    if (file.size > 1024 * 1024) { // 1MB limit
                                        toast.error("Imagem muito grande. Máximo 1MB.")
                                        return
                                    }
                                    const reader = new FileReader()
                                    reader.onloadend = () => {
                                        setLogo(reader.result as string)
                                    }
                                    reader.readAsDataURL(file)
                                }
                            }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">Envie uma imagem quadrada (PNG/JPG) de até 1MB.</p>
                </div>

                <Button onClick={save} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Alterações
                </Button>
            </CardContent>
        </Card>
    )
}
