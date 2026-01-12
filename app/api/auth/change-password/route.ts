import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { password } = body

        if (!password || password.length < 6) {
            return new NextResponse("Invalid password", { status: 400 })
        }

        const hashedPassword = await hash(password, 10)

        await db.query(
            "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
            [hashedPassword, user.id]
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[CHANGE_PASSWORD]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
