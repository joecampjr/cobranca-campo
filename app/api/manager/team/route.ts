import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser()

        if (!user || !["manager", "company_admin"].includes(user.role)) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { name, email, cpf, branch, password } = await req.json()

        // Basic validation
        if (!email || !password || !name) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // Check if user exists
        const existingUser = await db.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        )

        if (existingUser.rows.length > 0) {
            return new NextResponse("Email already exists", { status: 400 })
        }

        const hashedPassword = await hash(password, 10)

        // Insert new collector
        const result = await db.query(
            `INSERT INTO users (name, email, password_hash, role, company_id, cpf, branch, created_at, updated_at) 
       VALUES ($1, $2, $3, 'collector', $4, $5, $6, NOW(), NOW()) 
       RETURNING id, name, email`,
            [name, email, hashedPassword, user.company_id, cpf, branch]
        )

        return NextResponse.json(result.rows[0])
    } catch (error) {
        console.error("[TEAM_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
