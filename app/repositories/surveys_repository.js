import Survey from "../models/survey.js"
import AdminSurvey from "../models/admin_survey.js"

class SurveysRepository {
  constructor(database_client) {
    this.database_client = database_client
  }

  async get_surveys() {
    const response = await this.database_client.query("SELECT id, question, active FROM surveys")

    let surveys = []

    for(const row of response.rows) {
      let survey = new AdminSurvey(row.id, row.question, row.active)

      surveys.push(survey)
    }

    return surveys
  }

  async get_active_surveys() {
    const response = await this.database_client.query("SELECT id, question FROM surveys WHERE active = true")

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

  async get_active_survey(survey_id) {
    const response = await this.database_client.query("SELECT id, question FROM surveys WHERE id = $1 AND active = true LIMIT 1", [survey_id])

    const row = response.rows[0]

    const survey = new Survey(row.id, row.question)

    return survey
  }

  async create_survey(question) {
    const response = await this.database_client.query("INSERT INTO surveys(question) VALUES($1) RETURNING *", [question])

    const row = response.rows[0]

    const survey = new Survey(row.id, row.question)

    return survey
  }

  async update_survey(survey_id, question) {
    await this.database_client.query("UPDATE surveys SET question = $1 WHERE id = $2", [question, survey_id])
  }

  async toggle(survey_id) {
    const response = await this.database_client.query("SELECT active FROM surveys WHERE id = $1 LIMIT 1", [survey_id])

    const active = response.rows[0].active

    await this.database_client.query("UPDATE surveys SET active = $1 WHERE id = $2", [!active, survey_id])
  }
}

export default SurveysRepository
