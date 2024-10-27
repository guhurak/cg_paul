async function migrate(database) {
  const request = `
    ALTER TABLE surveys
    ADD COLUMN active BOOLEAN NOT NULL DEFAULT false
  `

  const parsed_request = request.replace(/(\n|\s)+/gm, ' ')

  await database.client.query(parsed_request)
}

export default migrate
