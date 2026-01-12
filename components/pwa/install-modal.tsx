"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Share, PlusSquare } from "lucide-react"

interface InstallModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function InstallModal({ open, onOpenChange }: InstallModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Instalar Aplicativo</DialogTitle>
                    <DialogDescription>
                        Instale nossa aplicação na sua tela inicial para um acesso mais rápido e melhor experiência.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <Share className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">1. Toque no botão Compartilhar</p>
                            <p className="text-xs text-muted-foreground">Localizado na barra inferior do Safari.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <PlusSquare className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">2. Selecione "Adicionar à Tela de Início"</p>
                            <p className="text-xs text-muted-foreground">Role para baixo para encontrar a opção.</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
