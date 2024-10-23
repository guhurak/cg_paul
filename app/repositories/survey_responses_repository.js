import SurveyResponse from "../models/survey_response.js"

class SurveyResponseRepository {
  constructor(database_client) {
    this.database_client = database_client
  }

  async get_from_survey(survey_id) {
    const response = await this.database_client.query("SELECT id, response FROM survey_responses WHERE survey_id = $1", [survey_id])

    let survey_responses = []

    for(const row of response.rows) {
      const survey_response = new SurveyResponse(row.id, row.response)

      survey_responses.push(survey_response)
    }

    return survey_responses
  }

  async create_responses_for_survey(survey_id, responses) {
    const responses_payload = []

    for(const response of responses) {
      responses_payload.push([survey_id, response])
    }

    await this.database_client.query("INSERT INTO survey_responses(survey_id, response) VALUES($1)", [responses_payload])
  }
}

export default SurveyResponseRepository
