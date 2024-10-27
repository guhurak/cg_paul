class SurveyParticipationsRepository {
  constructor(database_client) {
    this.database_client = database_client
  }

  async already_voted_survey(user_id, survey_id) {
    const response = await this.database_client.query("SELECT id FROM survey_participations WHERE user_id = $1 AND survey_id = $2 LIMIT 1", [user_id, survey_id])

    return response.rowCount > 0
  }

  async create_for_survey(user_id, survey_id) {
    await this.database_client.query("INSERT INTO survey_participations(user_id, survey_id) VALUES($1, $2)", [user_id, survey_id])
  }
}

export default SurveyParticipationsRepository
