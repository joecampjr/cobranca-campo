import { ManagerHeader } from "@/components/manager/manager-header"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
    const user = await getCurrentUser()
    if (!user) return {}

    const companyRes = await db.query("SELECT display_name, logo_url FROM companies WHERE id = $1", [user.company_id])
    const branding = companyRes.rows[0] || {}

    return {
        title: branding.display_name || "Cobrança em Campo",
        icons: branding.logo_url ? { icon: branding.logo_url } : undefined
    }
}

export default async function ManagerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/signin")
    }

    if (!["manager", "company_admin"].includes(user.role)) {
        redirect("/signin")
    }

    // Fetch branding
    const companyRes = await db.query("SELECT display_name, logo_url FROM companies WHERE id = $1", [user.company_id])
    const branding = companyRes.rows[0] || {}

    return (
        <div className="min-h-screen bg-muted/20">
            <ManagerHeader user={user} branding={branding} />
            {children}
        </div>
    )
}
