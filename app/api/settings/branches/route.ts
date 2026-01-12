import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { NextResponse } from "next/server"

// GET: List Branches
export async function GET(req: Request) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "company_admin") { // Only admin usually manages structure
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const branches = await db.query(
            "SELECT * FROM branches WHERE company_id = $1 ORDER BY name ASC",
            [user.company_id]
        )

        return NextResponse.json(branches.rows)
    } catch (error) {
        console.error("[BRANCHES_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// POST: Create Branch
export async function POST(req: Request) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "company_admin") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { name } = body

        if (!name) {
            return new NextResponse("Name required", { status: 400 })
        }

        const branch = await db.query(
            "INSERT INTO branches (company_id, name) VALUES ($1, $2) RETURNING *",
            [user.company_id, name]
        )

        return NextResponse.json(branch.rows[0])
    } catch (error) {
        console.error("[BRANCHES_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// DELETE: Remove Branch
export async function DELETE(req: Request) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "company_admin") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) return new NextResponse("ID required", { status: 400 })

        // Optional: Check if used by users? For now, simple delete.
        await db.query("DELETE FROM branches WHERE id = $1 AND company_id = $2", [id, user.company_id])

        return new NextResponse("Deleted", { status: 200 })

    } catch (error) {
        console.error("[BRANCHES_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
