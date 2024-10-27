import SurveysRepository from "../../../repositories/surveys_repository.js"
import SurveyResponseRepository from "../../../repositories/survey_responses_repository.js"

class SurveysController {
  constructor() {
    this.surveys_repository = new SurveysRepository(global.database_client)
    this.survey_responses_repository = new SurveyResponseRepository(global.database_client)
  }

  async index(_request, response) {
    const surveys_repository = new SurveysRepository(global.database_client)

    const surveys = await surveys_repository.get_surveys()

    return response.view("admin/surveys/index", { surveys: surveys, title: "Surveys" })
  }

  async show(request, response) {
    const surveys_repository = new SurveysRepository(global.database_client)
    const survey_responses_repository = new SurveyResponseRepository(global.database_client)

    const survey_id = request.params.survey_id

    const survey = await surveys_repository.get_survey(survey_id)

    const survey_responses = await survey_responses_repository.get_from_survey(survey.id)

    return response.view("admin/surveys/show", { survey: survey, survey_responses: survey_responses, title: "Survey" })
  }

  async new(_request, response) {
    return response.view("admin/surveys/new", { title: "New survey" })
  }

  async create(request, response) {
    const surveys_repository = new SurveysRepository(global.database_client)
    const survey_responses_repository = new SurveyResponseRepository(global.database_client)

    const survey = await surveys_repository.create_survey(request.body.question)

    if (request.body["responses[]"] != undefined) {
      let responses
      if (typeof(request.body["responses[]"]) == "string") {
        responses = [request.body["responses[]"]]
      } else {
        responses = request.body["responses[]"]
      }

      await survey_responses_repository.create_responses_for_survey(survey.id, responses)
    }

    return response.redirect("/surveys", 201)
  }

  async edit(request, response) {
    const surveys_repository = new SurveysRepository(global.database_client)
    const survey_responses_repository = new SurveyResponseRepository(global.database_client)

    const survey_id = request.params.survey_id

    const survey = await surveys_repository.get_survey(survey_id)

    const survey_responses = await survey_responses_repository.get_from_survey(survey.id)

    return response.view("admin/surveys/edit", { survey: survey, survey_responses: survey_responses, title: "Survey" })
  }

  async update(request, response) {
    const surveys_repository = new SurveysRepository(global.database_client)
    const survey_responses_repository = new SurveyResponseRepository(global.database_client)

    const survey_id = request.params.survey_id

    const survey = await surveys_repository.get_survey(survey_id)

    const survey_responses = await survey_responses_repository.get_from_survey(survey.id)

    let responses = []
    if (request.body["responses[]"] != undefined) {
      if (typeof(request.body["responses[]"]) == "string") {
        responses = [request.body["responses[]"]]
      } else {
        responses = request.body["responses[]"]
      }
    }

    await surveys_repository.update_survey(survey.id, request.body.question)
    await survey_responses_repository.update_responses_for_survey(survey.id, survey_responses, responses)

    return response.view(`admin/surveys/${survey.id}`)
  }
}

export default SurveysController
