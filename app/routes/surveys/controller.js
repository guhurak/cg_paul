class SurveysController {
  constructor() {}

  async index(_request, response) {
    return response.redirect("/")
  }
}

export default SurveysController
