import bcrypt from "bcryptjs"
import { db } from "./db"
import { cookies } from "next/headers"

const SALT_ROUNDS = 10
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export type UserRole = "super_admin" | "company_admin" | "manager" | "collector" | "customer"

export interface User {
  id: string
  company_id: string | null
  name: string
  email: string
  role: UserRole
  status: string
  phone?: string
  branch?: string
  commission_percentage?: number
  collection_goal?: number
}

export interface Session {
  id: string
  user_id: string
  token: string
  expires_at: Date
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Generate session token
function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// Create session
export async function createSession(userId: string): Promise<string> {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  await db.query("INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)", [userId, token, expiresAt])

  return token
}

// Get session
export async function getSession(token: string): Promise<Session | null> {
  const result = await db.query<Session>("SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()", [token])

  return result.rows[0] || null
}

// Get user from session
export async function getUserFromSession(token: string): Promise<User | null> {
  const result = await db.query<User>(
    `SELECT u.* FROM users u
     JOIN sessions s ON s.user_id = u.id
     WHERE s.token = $1 AND s.expires_at > NOW()`,
    [token],
  )

  return result.rows[0] || null
}

// Delete session
export async function deleteSession(token: string): Promise<void> {
  await db.query("DELETE FROM sessions WHERE token = $1", [token])
}

// Get current user (server component)
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value

  if (!token) return null

  return getUserFromSession(token)
}

// Check if user has permission
export function hasPermission(user: User | null, requiredRoles: UserRole[]): boolean {
  if (!user) return false
  return requiredRoles.includes(user.role)
}

// Create user
export async function createUser(data: {
  company_id?: string
  name: string
  email: string
  password: string
  role: UserRole
  document?: string
  phone?: string
}): Promise<User> {
  const passwordHash = await hashPassword(data.password)

  const result = await db.query<User>(
    `INSERT INTO users (company_id, name, email, password_hash, role, phone, document)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, company_id, name, email, role, status, phone, document`,
    [data.company_id || null, data.name, data.email, passwordHash, data.role, data.phone || null, data.document || null],
  )

  return result.rows[0]
}

// Sign in
export async function signIn(email: string, password: string): Promise<{ user: User; token: string } | null> {
  const result = await db.query("SELECT * FROM users WHERE email = $1 AND status = $2", [email, "active"])

  const user = result.rows[0]
  if (!user) return null

  const isValid = await verifyPassword(password, user.password_hash)
  if (!isValid) return null

  // Update last login
  await db.query("UPDATE users SET last_login_at = NOW() WHERE id = $1", [user.id])

  // Create session
  const token = await createSession(user.id)

  // Remove password_hash from response
  delete user.password_hash

  return { user, token }
}
