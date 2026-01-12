import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AsaasSettings } from "@/components/manager/asaas-settings"
import { BrandingTab } from "./branding-tab"
import { BranchesTab } from "./branches-tab"
import { SecurityTab } from "./security-tab"
import { db } from "@/lib/db"

async function getCompanySettings(companyId: string) {
    const res = await db.query("SELECT * FROM companies WHERE id = $1", [companyId])
    return res.rows[0]
}

export default async function SettingsPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== "company_admin") {
        redirect("/manager/dashboard")
    }

    const company = await getCompanySettings(user.company_id)

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Configurações</h1>

            <Tabs defaultValue="asaas" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="asaas">Integração Asaas</TabsTrigger>
                    <TabsTrigger value="branches">Filiais</TabsTrigger>
                    <TabsTrigger value="branding">Identidade Visual</TabsTrigger>
                    <TabsTrigger value="security">Segurança</TabsTrigger>
                </TabsList>

                <TabsContent value="asaas">
                    <AsaasSettings initialApiKey={company?.asaas_api_key} />
                </TabsContent>

                <TabsContent value="branches">
                    <BranchesTab />
                </TabsContent>

                <TabsContent value="branding">
                    <BrandingTab initialName={company?.display_name} initialLogo={company?.logo_url} />
                </TabsContent>

                <TabsContent value="security">
                    <SecurityTab />
                </TabsContent>
            </Tabs>
        </main>
    )
}
