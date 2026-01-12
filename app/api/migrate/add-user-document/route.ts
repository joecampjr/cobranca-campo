import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
    try {
        await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS document VARCHAR(20);
    `)
        return NextResponse.json({ message: "Migration executed: Added document to users table" })
    } catch (error: any) {
        console.error("Migration error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
