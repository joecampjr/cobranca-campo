"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

export function DataTab() {
    const handleDownload = () => {
        window.open('/api/backup', '_blank')
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Backup e Dados</CardTitle>
                <CardDescription>
                    Gerencie os dados da sua empresa. Faça backups regulares para garantir a segurança das informações.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                    <div className="space-y-1">
                        <h4 className="text-sm font-medium">Exportar Banco de Dados</h4>
                        <p className="text-xs text-muted-foreground">
                            Baixe um arquivo JSON contendo todos os clientes, cobranças e usuários.
                        </p>
                    </div>
                    <Button onClick={handleDownload} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Fazer Backup
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
