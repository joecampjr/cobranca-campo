import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { NewMemberForm } from "./new-member-form"

export default async function NewMemberPage() {
    const user = await getCurrentUser()

    if (!user || !["manager", "company_admin"].includes(user.role)) {
        redirect("/signin")
    }

    return (
        <main className="container max-w-2xl mx-auto px-4 py-8">
            <NewMemberForm currentUserRole={user.role} />
        </main>
    )
}
