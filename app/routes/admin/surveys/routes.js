import SurveysController from "./controller.js"

class SurveysRoutes {
  construct() {}

  load_routes(server, _opts, done) {
    const surveys_controller = new SurveysController()

    server.get("/", surveys_controller.index)
    server.get("/:survey_id", surveys_controller.show)
    server.get("/new", surveys_controller.new)
    server.post("/", surveys_controller.create)

    done()
  }
}

export default SurveysRoutes
