"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function HeaderLogout() {
    const router = useRouter()

    async function handleSignOut() {
        await fetch("/api/auth/signout", { method: "POST" })
        router.push("/signin")
    }

    return (
        <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <LogOut className="h-5 w-5" />
        </Button>
    )
}
