import SurveysRepository from "../../../repositories/surveys_repository.js"
import SurveyResponseRepository from "../../../repositories/survey_responses_repository.js"
import VotesRepository from "../../../repositories/votes_repository.js"
import SurveyParticipationsRepository from "../../../repositories/survey_participations_repository.js"

import DiscordApi from "../../../services/discord_api.js"

class SurveysController {
  constructor() {}

  async index(_request, response) {
    const surveys_repository = new SurveysRepository(global.database_client)

    const surveys = await surveys_repository.get_active_surveys()

    return response.view("app/surveys/index.ejs", { surveys: surveys, title: "Sondages" })
  }

  async show(request, response) {
    const surveys_repository = new SurveysRepository(global.database_client)
    const survey_responses_repository = new SurveyResponseRepository(global.database_client)
    const survey_participations_repository = new SurveyParticipationsRepository(global.database_client)

    const access_token = global.server.unsignCookie(request.cookies.access_token).value
    const discord_api = new DiscordApi(access_token)

    const survey = await surveys_repository.get_active_survey(request.params.survey_id)

    if (survey == undefined) {
      response.statusCode = 404

      return response.send({ error: "Survey not found" })
    }

    const survey_responses = await survey_responses_repository.get_from_survey(survey.id)

    const user_id = await discord_api.get_user_id()
    const already_voted = await survey_participations_repository.already_voted_survey(user_id, survey.id)

    return response.view("app/surveys/show.ejs", { survey: survey, survey_responses: survey_responses, already_voted: already_voted, title: survey.question })
  }

  async vote(request, response) {
    const surveys_repository = new SurveysRepository(global.database_client)
    const survey_responses_repository = new SurveyResponseRepository(global.database_client)
    const votes_repository = new VotesRepository(global.database_client)
    const survey_participations_repository = new SurveyParticipationsRepository(global.database_client)

    const access_token = global.server.unsignCookie(request.cookies.access_token).value
    const discord_api = new DiscordApi(access_token)

    const survey = await surveys_repository.get_active_survey(request.params.survey_id)

    if (survey == undefined) {
      response.statusCode = 404

      return response.send({ error: "Survey not found" })
    }

    const survey_response = await survey_responses_repository.get_from_vote(request.body.vote)

    if (survey_response == undefined || survey_response.survey_id != survey.id) {
      response.statusCode = 404

      return response.send({ error: "Survey response not found" })
    }

    const user_id = await discord_api.get_user_id()
    const already_voted = await survey_participations_repository.already_voted_survey(user_id, survey.id)

    if (already_voted) {
      response.statusCode = 422

      return response.send({ error: "Survey already voted" })
    }

    await votes_repository.create(survey.id, survey_response.id)
    await survey_participations_repository.create_for_survey(user_id, survey.id)

    response.statusCode = 201

    return response.send()
  }
}

export default SurveysController
