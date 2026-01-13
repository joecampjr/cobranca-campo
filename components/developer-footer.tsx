import Image from "next/image"

export function DeveloperFooter({ className }: { className?: string }) {
    return (
        <div className={`flex flex-col items-center justify-center p-6 space-y-2 opacity-80 hover:opacity-100 transition-opacity ${className}`}>
            <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground">
                Desenvolvido por
            </span>
            <div className="relative w-32 h-16 grayscale hover:grayscale-0 transition-all duration-500">
                <Image
                    src="/images/developer-logo.jpg"
                    alt="Infinite Business Group"
                    fill
                    className="object-contain"
                />
            </div>
            <p className="text-[10px] text-muted-foreground w-full text-center">
                &copy; {new Date().getFullYear()} Todos os direitos reservados
            </p>
        </div>
    )
}
