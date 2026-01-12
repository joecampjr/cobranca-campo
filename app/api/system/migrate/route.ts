import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        // Add branch column
        await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS branch TEXT;`)

        // Add cpf column (ensure it exists too)
        await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS cpf TEXT;`)

        return NextResponse.json({ message: "Migration applied successfully: Added 'branch' and 'cpf' columns to 'users' table." })
    } catch (error) {
        console.error("[MIGRATION_ERROR]", error)
        return NextResponse.json({ error: "Failed to apply migration", details: error }, { status: 500 })
    }
}
