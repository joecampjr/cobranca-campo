"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { toast } from "sonner"

export default function NewMemberPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [branches, setBranches] = useState<{ id: string, name: string }[]>([])

    useEffect(() => {
        fetch("/api/settings/branches")
            .then(res => res.json())
            .then(data => setBranches(data))
            .catch(console.error)
    }, [])

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const data = Object.fromEntries(formData.entries())

        try {
            const response = await fetch("/api/manager/team", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.text()
                throw new Error(error)
            }

            // Success
            router.push("/manager/team")
            router.refresh()
        } catch (error) {
            alert("Erro ao criar membro: " + (error instanceof Error ? error.message : "Erro desconhecido"))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="container max-w-2xl mx-auto px-4 py-8">
            <Link href="/manager/team">
                <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar para Equipe
                </Button>
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Adicionar Novo Membro</CardTitle>
                    <CardDescription>
                        Cadastre um novo cobrador. Ele terá acesso limitado para gerar cobranças.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input id="name" name="name" placeholder="Ex: João da Silva" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cpf">CPF</Label>
                                <Input
                                    id="cpf"
                                    name="cpf"
                                    placeholder="000.000.000-00"
                                    maxLength={14}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, "")
                                        if (value.length > 11) value = value.slice(0, 11)
                                        value = value.replace(/(\d{3})(\d)/, "$1.$2")
                                        value = value.replace(/(\d{3})(\d)/, "$1.$2")
                                        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
                                        e.target.value = value
                                    }}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="branch">Filial</Label>
                                <Select name="branch">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a filial" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {branches.length === 0 && <SelectItem value="disabled" disabled>Nenhuma filial cadastrada</SelectItem>}
                                        {branches.map(b => (
                                            <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email de Acesso</Label>
                            <Input id="email" name="email" type="email" placeholder="nome@empresa.com" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha Inicial</Label>
                            <Input id="password" name="password" type="password" required minLength={6} />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                "Criar Membro"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}
