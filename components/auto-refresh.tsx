"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AutoRefreshProps {
    intervalMs?: number
}

export function AutoRefresh({ intervalMs = 30000 }: AutoRefreshProps) {
    const router = useRouter()

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh()
        }, intervalMs)

        return () => clearInterval(interval)
    }, [router, intervalMs])

    return null
}
