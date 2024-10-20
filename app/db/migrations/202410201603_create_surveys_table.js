async function migrate(database) {
  const request = `
    CREATE TABLE surveys (
      id SERIAL PRIMARY KEY,
      question TEXT NOT NULL
    )
  `

  const parsed_request = request.replace(/(\n|\s)+/gm, ' ')

  await database.client.query(parsed_request)
}

export default migrate
