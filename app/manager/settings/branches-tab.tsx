"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"

interface Branch {
    id: string
    name: string
}

export function BranchesTab() {
    const [branches, setBranches] = useState<Branch[]>([])
    const [newBranch, setNewBranch] = useState("")
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        fetchBranches()
    }, [])

    async function fetchBranches() {
        try {
            const res = await fetch("/api/settings/branches")
            if (res.ok) {
                const data = await res.json()
                setBranches(data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setFetching(false)
        }
    }

    async function addBranch() {
        if (!newBranch.trim()) return
        setLoading(true)
        try {
            const res = await fetch("/api/settings/branches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newBranch })
            })
            if (res.ok) {
                setNewBranch("")
                fetchBranches()
                toast.success("Filial adicionada!")
            }
        } catch (e) {
            toast.error("Erro ao adicionar")
        } finally {
            setLoading(false)
        }
    }

    async function deleteBranch(id: string) {
        if (!confirm("Tem certeza? Usuários vinculados podem perder a referência.")) return
        try {
            await fetch(`/api/settings/branches?id=${id}`, { method: "DELETE" })
            fetchBranches()
            toast.success("Filial removida")
        } catch (e) {
            toast.error("Erro ao remover")
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gerenciar Filiais</CardTitle>
                <CardDescription>Cadastre as unidades do seu negócio para organizar a equipe.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-2">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="branchName">Nova Filial</Label>
                        <Input
                            id="branchName"
                            placeholder="Ex: Matriz, Centro, Zona Sul..."
                            value={newBranch}
                            onChange={(e) => setNewBranch(e.target.value)}
                        />
                    </div>
                    <Button className="mt-auto" onClick={addBranch} disabled={loading || !newBranch}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        Adicionar
                    </Button>
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Filiais Cadastradas</h3>
                    {fetching ? (
                        <div className="text-sm">Carregando...</div>
                    ) : branches.length === 0 ? (
                        <div className="text-sm text-muted-foreground italic">Nenhuma filial cadastrada.</div>
                    ) : (
                        <div className="border rounded-md divide-y">
                            {branches.map(branch => (
                                <div key={branch.id} className="p-3 flex items-center justify-between text-sm">
                                    <span>{branch.name}</span>
                                    <Button variant="ghost" size="sm" onClick={() => deleteBranch(branch.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
