import { type NextRequest, NextResponse } from "next/server"
import { signIn } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const result = await signIn(email, password)

    if (!result) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("session_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return NextResponse.json({ user: result.user })
  } catch (error) {
    console.error("Sign in error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
