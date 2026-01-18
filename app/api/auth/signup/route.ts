import { type NextRequest, NextResponse } from "next/server"
import { createUser, createSession } from "@/lib/auth"
import { cookies } from "next/headers"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, cpf } = await request.json()

    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous"
    const rl = await rateLimit(`signup:${ip}`, 3, 3600) // Max 3 signups per hour per IP

    if (!rl.success) {
      return NextResponse.json({ error: "Too many signups from this IP. Please try again later." }, { status: 429 })
    }

    if (!name || !email || !password || !cpf) {
      return NextResponse.json({ error: "Name, email, password and CPF are required" }, { status: 400 })
    }

    // Create user with customer role by default (for company signup, use company_admin)
    const user = await createUser({
      name,
      email,
      password,
      role: "customer",
      phone,
      document: cpf.replace(/\D/g, ""), // Clean CPF
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
