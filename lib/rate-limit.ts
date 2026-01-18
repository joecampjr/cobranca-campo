import { db } from "./db"

export async function rateLimit(key: string, limit = 5, windowSeconds = 60): Promise<{ success: boolean; remaining: number }> {
    const now = new Date()
    const windowStart = new Date(now.getTime() - windowSeconds * 1000)

    try {
        // Clean up old entries
        await db.query("DELETE FROM rate_limits WHERE created_at < $1", [windowStart])

        // Count current attempts
        const result = await db.query("SELECT COUNT(*) as count FROM rate_limits WHERE key = $1", [key])
        const count = parseInt(result.rows[0].count)

        if (count >= limit) {
            return { success: false, remaining: 0 }
        }

        // Add new attempt
        await db.query("INSERT INTO rate_limits (key, created_at) VALUES ($1, $2)", [key, now])

        return { success: true, remaining: limit - count - 1 }
    } catch (error) {
        console.error("Rate limit error:", error)
        // Fail open if database is down (optional, but safer for UX)
        return { success: true, remaining: 1 }
    }
}
