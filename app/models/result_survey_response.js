class ResultSurveyResponse {
  constructor(id, survey_id, response, votes_count) {
    this.id = id
    this.survey_id = survey_id
    this.response = response
    this.votes_count = votes_count
  }
}

export default ResultSurveyResponse
