import SurveysRepository from "../../repositories/surveys_repository.js"
import SurveyResponseRepository from "../../repositories/survey_responses_repository.js"

class SurveysController {
  constructor() {}

  async index(_request, response) {
    const surveys_repository = new SurveysRepository(global.database_client)

    const surveys = await surveys_repository.get_surveys()

    return response.view("app/views/surveys/index", { surveys: surveys, title: "Surveys" })
  }

  async show(request, response) {
    const surveys_repository = new SurveysRepository(global.database_client)
    const survey_responses_repository = new SurveyResponseRepository(global.database_client)

    const survey_id = request.params.survey_id

    const survey = await surveys_repository.get_survey(survey_id)

    const survey_responses = await survey_responses_repository.get_from_survey(survey.id)

    return response.view("app/views/surveys/show", { survey: survey, survey_responses: survey_responses, title: "Survey" })
  }

  async new(_request, response) {
    return response.view("app/views/surveys/new", { title: "New survey" })
  }

  async create(request, response) {
    const surveys_repository = new SurveysRepository(global.database_client)

    await surveys_repository.create_survey(request.body.question)

    return response.redirect("/surveys", 201)
  }
}

export default SurveysController
