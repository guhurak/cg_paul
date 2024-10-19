import pg from "pg"

class Database {
  constructor() {
    const { Client } = pg

    this.client = new Client({
      user: "paul",
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      port: 5432,
      database: "paul"
    })
  }

  async connect() {
    await this.client.connect()
  }
}

export default Database
