async function migrate(database) {
  const request = `
    CREATE TABLE votes (
      id SERIAL PRIMARY KEY,
      survey_id INTEGER NOT NULL,
      survey_response_id INTEGER NOT NULL,
      CONSTRAINT fk_vote_survey
        FOREIGN KEY(survey_id)
        REFERENCES surveys(id)
        ON DELETE CASCADE,
      CONSTRAINT fk_vote_survey_response
        FOREIGN KEY(survey_response_id)
        REFERENCES survey_responses(id)
        ON DELETE CASCADE)
  `

  const parsed_request = request.replace(/(\n|\s)+/gm, ' ')

  await database.client.query(parsed_request)
}

export default migrate
