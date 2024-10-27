class HomeController {
  constructor() {}

  index(_request, response) {
    return response.redirect("/app/surveys")
  }
}

export default HomeController
