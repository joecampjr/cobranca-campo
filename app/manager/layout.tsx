import { ManagerHeader } from "@/components/manager/manager-header"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ManagerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/signin")
    }

    // Double check basic access, though pages do specific checks
    if (!["manager", "company_admin"].includes(user.role)) {
        redirect("/signin")
    }

    return (
        <div className="min-h-screen bg-muted/20">
            <ManagerHeader user={user} />
            {children}
        </div>
    )
}
