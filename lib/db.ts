// Database client singleton
// This will work with any Postgres provider (Neon, Supabase, etc.)

type QueryResult<T = any> = {
  rows: T[]
  rowCount: number
}

class Database {
  private static instance: Database

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    // This is a placeholder that will work with any DB client
    // Users can replace this with their actual DB client (neon, pg, etc.)
    throw new Error("Database not configured. Please set up your database connection.")
  }
}

export const db = Database.getInstance()
