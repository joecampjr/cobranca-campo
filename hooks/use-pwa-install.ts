"use client"

import { useState, useEffect } from "react"

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export function usePwaInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isSupported, setIsSupported] = useState(false)
    const [isIOS, setIsIOS] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setIsInstalled(true)
        }

        // Check if iOS
        const userAgent = window.navigator.userAgent.toLowerCase()
        const ios = /iphone|ipad|ipod/.test(userAgent)
        setIsIOS(ios)

        // Capture the event
        const handler = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
            setIsSupported(true)
        }

        window.addEventListener("beforeinstallprompt", handler)

        return () => window.removeEventListener("beforeinstallprompt", handler)
    }, [])

    const promptInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt()
            const { outcome } = await deferredPrompt.userChoice
            if (outcome === "accepted") {
                setDeferredPrompt(null)
            }
        }
    }

    return { isSupported, isIOS, isInstalled, promptInstall }
}
