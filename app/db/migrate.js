import Database from "../services/database.js"
import versions from "./migrations/index.js"

async function migrate() {
  const database = new Database()

  await database.connect()

  await database.client.query("CREATE TABLE IF NOT EXISTS migrations (id SERIAL PRIMARY KEY, version VARCHAR(255) UNIQUE NOT NULL)")

  const last_version = await database.client.query("SELECT version FROM migrations ORDER BY version DESC LIMIT 1")

  try {
    await database.client.query("BEGIN")

    for(const version of versions) {
      if(last_version.rows[0] == undefined || parseInt(last_version.rows[0].version) < parseInt(version[0])) {
        version[1](database)

        await database.client.query("INSERT INTO migrations(version) VALUES ($1::VARCHAR)", [version[0]])
      }
    }

    await database.client.query("COMMIT")
  } catch(e) {
    await database.client.query("ROLLBACK")
    throw e
  } finally {
    await database.client.end()
  }
}

migrate()
