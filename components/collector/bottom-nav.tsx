"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, History, User, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function CollectorBottomNav() {
    const pathname = usePathname()

    const items = [
        {
            href: "/collector",
            label: "Início",
            icon: Home
        },
        {
            href: "/collector/new-charge",
            label: "Cobrar",
            icon: PlusCircle,
            highlight: true
        },
        {
            href: "/collector/history",
            label: "Histórico",
            icon: History
        },
        {
            href: "/collector/profile",
            label: "Perfil",
            icon: User
        }
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-50 pb-safe">
            <div className="flex justify-around items-center p-2">
                {items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.href} href={item.href} className="flex-1">
                            <div className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
                                item.highlight && "text-primary font-bold"
                            )}>
                                {item.highlight ? (
                                    <div className="bg-primary text-primary-foreground rounded-full p-2 mb-1 -mt-6 border-4 border-background shadow-lg">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                ) : (
                                    <item.icon className="h-5 w-5 mb-1" />
                                )}
                                <span className="text-[10px] uppercase tracking-wide">{item.label}</span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
