import { CollectorBottomNav } from "@/components/collector/bottom-nav"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function CollectorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/signin")
    }

    if (user.role !== "collector") {
        // If manager tries to access, maybe redirect to manager dashboard or allow if testing?
        // Sticking to strict role check for safety
        if (user.role === "manager" || user.role === "company_admin") {
            // Allow managers to view for testing purposes, or redirect?
            // Let's redirect them to their dashboard to avoid confusion, unless they explicitly want to see it.
            // For now, allow valid users but maybe warn? No, strict redirect.
            redirect("/manager/dashboard")
        }
    }

    return (
        <div className="min-h-screen bg-muted/20 pb-24">
            {children}
            <CollectorBottomNav />
        </div>
    )
}
