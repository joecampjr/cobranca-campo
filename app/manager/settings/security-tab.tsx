"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export function SecurityTab() {
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    async function changePassword() {
        if (password.length < 6) {
            toast.error("A senha deve ter no mínimo 6 caracteres")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            })
            if (res.ok) {
                toast.success("Senha alterada com sucesso!")
                setPassword("")
            } else {
                toast.error("Erro ao alterar senha")
            }
        } catch (e) {
            toast.error("Erro ao alterar senha")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>Atualize sua senha de acesso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                        id="newPassword"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="******"
                    />
                </div>

                <Button onClick={changePassword} disabled={loading || !password}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Alterar Senha
                </Button>
            </CardContent>
        </Card>
    )
}
