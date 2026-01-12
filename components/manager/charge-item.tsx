"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Calendar, User, Trash2, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"

interface ChargeItemProps {
    charge: any
    currentUserRole: string
}

export function ChargeItem({ charge, currentUserRole }: ChargeItemProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" }> = {
        "PENDING": { label: "Pendente", variant: "secondary" },
        "RECEIVED": { label: "Pago", variant: "success" },
        "CONFIRMED": { label: "Confirmado", variant: "success" },
        "OVERDUE": { label: "Vencido", variant: "destructive" },
    }

    const handleDelete = async () => {
        if (!confirm("Tem certeza que deseja excluir esta cobrança? Ela será removida também do Asaas.")) return

        setIsDeleting(true)
        try {
            const res = await fetch(`/api/charges/${charge.id}`, {
                method: "DELETE"
            })

            if (!res.ok) {
                const err = await res.text()
                throw new Error(err)
            }

            toast.success("Cobrança removida com sucesso")
            router.refresh()
        } catch (error) {
            toast.error("Erro ao excluir: " + (error instanceof Error ? error.message : "Erro desconhecido"))
        } finally {
            setIsDeleting(false)
        }
    }

    const canDelete = ["manager", "company_admin"].includes(currentUserRole)

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4">
            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{charge.customer_name || "Cliente sem nome"}</span>
                    <Badge variant={statusMap[charge.status]?.variant || "outline"}>
                        {statusMap[charge.status]?.label || charge.status}
                    </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>Cobrador: {charge.collector_name || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="font-mono">{charge.customer_cpf}</div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(charge.created_at).toLocaleString("pt-BR")}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 justify-between md:justify-end w-full md:w-auto">
                <div className="text-right">
                    <div className="text-sm text-muted-foreground">Valor</div>
                    <div className="text-xl font-bold text-primary">
                        {formatCurrency(Number(charge.amount))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {charge.asaas_invoice_url && (
                        <a href={charge.asaas_invoice_url} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="h-9 w-9 p-0 md:h-9 md:w-auto md:px-3 md:py-2">
                                <ExternalLink className="h-4 w-4 md:mr-2" />
                                <span className="hidden md:inline">Link</span>
                            </Button>
                        </a>
                    )}

                    {canDelete && (
                        <Button
                            size="sm"
                            variant="destructive"
                            className="h-9 w-9 p-0"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
