async function migrate(database) {
  const request = `
    CREATE TABLE survey_participations (
      id SERIAL PRIMARY KEY,
      survey_id INTEGER NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      CONSTRAINT fk_survey_participation_survey
        FOREIGN KEY(survey_id)
        REFERENCES surveys(id)
        ON DELETE CASCADE)
  `

  const parsed_request = request.replace(/(\n|\s)+/gm, ' ')

  await database.client.query(parsed_request)
}

export default migrate
