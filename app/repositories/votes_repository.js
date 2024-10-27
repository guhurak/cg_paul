class VotesRepository {
  constructor(database_client) {
    this.database_client = database_client
  }

  async create(survey_id, survey_response_id) {
    await this.database_client.query("INSERT INTO votes(survey_id, survey_response_id) VALUES($1, $2)", [survey_id, survey_response_id])
  }
}

export default VotesRepository
