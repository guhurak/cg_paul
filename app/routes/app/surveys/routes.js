import SurveysController from "./controller.js"

class SurveysRoutes {
  constructor() {}

  load_routes(server, _opts, done) {
    const surveys_controller = new SurveysController()

    server.get("/", surveys_controller.index)
    server.get("/:survey_id", surveys_controller.show)
    server.post("/:survey_id/vote", surveys_controller.vote)

    done()
  }
}

export default SurveysRoutes
