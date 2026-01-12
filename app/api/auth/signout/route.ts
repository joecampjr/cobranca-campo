import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { deleteSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("session_token")?.value

    if (token) {
      await deleteSession(token)
    }

    cookieStore.delete("session_token")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Sign out error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
