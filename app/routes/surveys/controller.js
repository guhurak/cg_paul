class SurveysController {
  constructor() {}

  async index(_request, response) {
    return response.view("app/views/surveys/index", { title: "Surveys" })
  }
}

export default SurveysController
