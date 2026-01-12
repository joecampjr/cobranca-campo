import { createPool, type QueryResult as VercelQueryResult, type QueryResultRow } from "@vercel/postgres"

type QueryResult<T extends QueryResultRow> = {
  rows: T[]
  rowCount: number
}

class Database {
  private static instance: Database
  private pool = createPool()

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  async query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const result = await this.pool.query<T>(text, params)
    return {
      rows: result.rows,
      rowCount: result.rowCount || 0,
    }
  }
}

export const db = Database.getInstance()
