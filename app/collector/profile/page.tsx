"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LogOut, Download } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { usePwaInstall } from "@/hooks/use-pwa-install"
import { InstallModal } from "@/components/pwa/install-modal"

export default function CollectorProfilePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const { isSupported, isIOS, isInstalled, promptInstall } = usePwaInstall()
    const [showInstallModal, setShowInstallModal] = useState(false)

    const handleInstallClick = () => {
        if (isIOS) {
            setShowInstallModal(true)
        } else {
            promptInstall()
        }
    }

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            toast.error("As novas senhas não coincidem")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword })
            })

            if (!res.ok) {
                const error = await res.text()
                throw new Error(error)
            }

            toast.success("Senha alterada com sucesso!")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } catch (error: any) {
            toast.error(error.message || "Erro ao alterar senha")
        } finally {
            setLoading(false)
        }
    }

    async function handleSignOut() {
        await fetch("/api/auth/signout", { method: "POST" })
        router.push("/signin")
    }

    return (
        <div className="space-y-6 p-4">
            <header className="pb-4 border-b">
                <h1 className="text-xl font-bold">Meu Perfil</h1>
            </header>

            {(!isInstalled && (isSupported || isIOS)) && (
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                            <Download className="mr-2 h-5 w-5 text-primary" />
                            Instalar Aplicativo
                        </CardTitle>
                        <CardDescription>
                            Instale o app para acesso rápido e offline.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleInstallClick} className="w-full">
                            Instalar Agora
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Alterar Senha</CardTitle>
                    <CardDescription>Mantenha sua conta segura.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current">Senha Atual</Label>
                            <Input
                                id="current"
                                type="password"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new">Nova Senha</Label>
                            <Input
                                id="new"
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm">Confirmar Nova Senha</Label>
                            <Input
                                id="confirm"
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Atualizar Senha
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Button variant="destructive" className="w-full" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair da Conta
            </Button>

            <InstallModal open={showInstallModal} onOpenChange={setShowInstallModal} />
        </div>
    )
}
