import pg_format from "pg-format"

import SurveyResponse from "../models/survey_response.js"
import ResultSurveyResponse from "../models/result_survey_response.js"

class SurveyResponseRepository {
  constructor(database_client) {
    this.database_client = database_client
  }

  async get_from_survey(survey_id) {
    const response = await this.database_client.query("SELECT id, survey_id, response FROM survey_responses WHERE survey_id = $1", [survey_id])

    let survey_responses = []

    for(const row of response.rows) {
      const survey_response = new SurveyResponse(row.id, row.survey_id, row.response)

      survey_responses.push(survey_response)
    }

    return survey_responses
  }

  async get_from_survey_with_votes(survey_id) {
    const response = await this.database_client.query("SELECT sr.id, sr.survey_id, sr.response, COUNT(v.id) AS votes_count FROM survey_responses AS sr LEFT JOIN votes AS v ON v.survey_response_id = sr.id WHERE sr.survey_id = $1 GROUP BY sr.id", [survey_id])

    let survey_responses = []

    for(const row of response.rows) {
      const survey_response = new ResultSurveyResponse(row.id, row.survey_id, row.response, row.votes_count)

      survey_responses.push(survey_response)
    }

    return survey_responses
  }

  async get_from_vote(vote) {
    const response = await this.database_client.query("SELECT id, survey_id, response FROM survey_responses WHERE id = $1", [vote])

    const row = response.rows[0]

    const survey_response = new SurveyResponse(row.id, row.survey_id, row.response)

    return survey_response
  }

  async create_responses_for_survey(survey_id, responses) {
    let responses_payload = []

    for(const response of responses) {
      responses_payload.push([survey_id, response])
    }

    const query = pg_format("INSERT INTO survey_responses(survey_id, response) VALUES %L", responses_payload)

    await this.database_client.query(query)
  }

  async update_responses_for_survey(survey_id, survey_responses, responses) {
    let survey_responses_to_delete = []
    let new_responses = responses

    for(const survey_response of survey_responses) {
      if (responses.includes(survey_response.response)) {
        new_responses = new_responses.slice(new_responses.indexOf(survey_response.response))
      } else {
        survey_responses_to_delete.push(survey_response.id)
      }
    }

    if (survey_responses_to_delete.length > 0) {
      const query = pg_format("DELETE FROM survey_responses WHERE id IN %L", survey_responses_to_delete)
      await this.database_client.query(query)
    }

    if (new_responses.length > 0) {
      let responses_payload = []

      for(const response of new_responses) {
        responses_payload.push([survey_id, response])
      }

      const query = pg_format("INSERT INTO survey_responses(survey_id, response) VALUES %L", responses_payload)

      await this.database_client.query(query)
    }
  }
}

export default SurveyResponseRepository
