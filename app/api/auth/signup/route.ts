import { type NextRequest, NextResponse } from "next/server"
import { createUser, createSession } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Create user with customer role by default (for company signup, use company_admin)
    const user = await createUser({
      name,
      email,
      password,
      role: "customer",
      phone,
    })

    // Create session
    const token = await createSession(user.id)

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error("Sign up error:", error)

    if (error.code === "23505") {
      // Unique violation
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
