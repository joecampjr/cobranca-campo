import { Pool, type QueryResult, type QueryResultRow } from "pg"

class Database {
  private static instance: Database
  private pool: Pool | undefined

  private constructor() { }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  async query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    if (!this.pool) {
      this.pool = new Pool({
        connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
      })
    }
    return this.pool.query<T>(text, params)
  }
}

export const db = Database.getInstance()
