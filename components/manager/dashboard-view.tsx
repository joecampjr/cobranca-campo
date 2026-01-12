"use client"

import { useState } from "react"
import { ChargeItem } from "@/components/manager/charge-item"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"

interface DashboardViewProps {
    initialCharges: any[]
    branches: string[]
    currentUserRole: string
    companyName: string
}

export function DashboardView({ initialCharges, branches, currentUserRole, companyName }: DashboardViewProps) {
    const [selectedBranch, setSelectedBranch] = useState<string>("all")
    const [charges, setCharges] = useState(initialCharges)

    const filteredCharges = selectedBranch && selectedBranch !== "all"
        ? charges.filter(c => c.collector_branch === selectedBranch)
        : charges

    const handleChargeDeleted = (deletedId: string) => {
        setCharges(current => current.filter(c => c.id !== deletedId))
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Últimas Cobranças</CardTitle>
                        <CardDescription>Lista das últimas cobranças geradas.</CardDescription>
                    </div>

                    {/* Branch Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filtrar por Filial" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as Filiais</SelectItem>
                                {branches.map(branch => (
                                    <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {filteredCharges.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Nenhuma cobrança encontrada neste filtro.
                        </div>
                    ) : (
                        filteredCharges.map((charge) => (
                            <ChargeItem
                                key={charge.id}
                                charge={charge}
                                currentUserRole={currentUserRole}
                                companyName={companyName}
                                onDelete={() => handleChargeDeleted(charge.id)}
                            />
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
