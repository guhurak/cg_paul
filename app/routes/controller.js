class HomeController {
  constructor() {}

  index(_request, response) {
    return response.view("app/views/home", { title: "Homepage" })
  }
}

export default HomeController
