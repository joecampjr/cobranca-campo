import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        // Add branch column
        await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS branch TEXT;`)

        // Add cpf column (ensure it exists too)
        await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS cpf TEXT;`)

        // Create branches table
        await db.query(`
            CREATE TABLE IF NOT EXISTS branches (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `)

        // Add branding columns to companies
        await db.query(`ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_url TEXT;`)
        await db.query(`ALTER TABLE companies ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);`)

        return NextResponse.json({ message: "Migration applied successfully: Users(branch, cpf), Branches table, Companies(logo, name)." })
    } catch (error) {
        console.error("[MIGRATION_ERROR]", error)
        return NextResponse.json({ error: "Failed to apply migration", details: error }, { status: 500 })
    }
}
