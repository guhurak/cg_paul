import Survey from "../models/survey.js"

class SurveysRepository {
  constructor(database_client) {
    this.database_client = database_client
  }

  async get_surveys() {
    const response = await this.database_client.query("SELECT id, question FROM surveys")

    let surveys = []

    for(const row of response.rows) {
      let survey = new Survey(row.id, row.question)

      surveys.push(survey)
    }

    return surveys
  }

  async get_survey(survey_id) {
    const response = await this.database_client.query("SELECT id, question FROM surveys WHERE id = $1 LIMIT 1", [survey_id])

    const row = response.rows[0]

    const survey = new Survey(row.id, row.question)

    return survey
  }

  async create_survey(question) {
    await this.database_client.query("INSERT INTO surveys(question) VALUES($1)", [question])
  }
}

export default SurveysRepository
