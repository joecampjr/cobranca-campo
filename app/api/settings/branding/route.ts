import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "company_admin") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { displayName, logoUrl } = body

        // Update company
        // We update regardless of which fields are present (partial updates allowed implicitly if we built dynamic query, but here simple fixed update)
        // To be safer, we can do coalescing or just update what's sent.
        // Simple approach: Update both, assuming FE sends current values if unchanged.

        await db.query(
            `UPDATE companies SET 
            display_name = COALESCE($1, display_name),
            logo_url = COALESCE($2, logo_url),
            updated_at = NOW()
        WHERE id = $3`,
            [displayName, logoUrl, user.company_id]
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[BRANDING_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
