import Database from "../../services/database.js"

async function migrate() {
  const database = new Database()

  await database.connect()

  await database.client.query("CREATE TABLE survey_responses (id SERIAL PRIMARY KEY, user_id VARCHAR(255) UNIQUE NOT NULL, response VARCHAR(255) NOT NULL)")

  database.client.end()
}

migrate()
