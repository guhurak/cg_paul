import SurveysRepository from "../../../repositories/surveys_repository.js"
import SurveyResponseRepository from "../../../repositories/survey_responses_repository.js"

class SurveysController {
  constructor() {}

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

    console.log(request.body)

    const survey = await surveys_repository.create_survey(request.body.question)

    if (request.body.responses != undefined) {
      await survey_responses_repository.create_responses_for_survey(survey.id, request.body.responses)
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
}

export default SurveysController
