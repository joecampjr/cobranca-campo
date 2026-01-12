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

        const { name, email, cpf, branch, password, role = 'collector' } = await req.json()

        // Permission check
        if (user.role === 'manager' && role !== 'collector') {
            return new NextResponse("Managers can only create collectors", { status: 403 })
        }

        const validRoles = ['collector', 'manager', 'company_admin']
        if (!validRoles.includes(role)) {
            return new NextResponse("Invalid role", { status: 400 })
        }

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

        // Insert new user
        const result = await db.query(
            `INSERT INTO users (name, email, password_hash, role, company_id, cpf, branch, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
       RETURNING id, name, email`,
            [name, email, hashedPassword, role, user.company_id, cpf, branch]
        )

        return NextResponse.json(result.rows[0])
    } catch (error) {
        console.error("[TEAM_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
