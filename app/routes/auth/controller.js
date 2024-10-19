import DiscordAuth from "../../services/discord_auth.js"

class AuthController {
  constructor() {}

  login(_request, response) {
    return response.view("app/views/auth/login", { title: "Login" })
  }

  logout(_request, response) {
    response.clearCookie("access_token")
    response.clearCookie("refresh_token")

    return response.redirect("/auth/login")
  }

  async discord(request, response) {
    const code = request.query.code

    const discord_auth = new DiscordAuth(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_CLIENT_SECRET)

    const tokens = await discord_auth.get_access_token(code, process.env.DISCORD_REDIRECT_URI)

    response.setCookie("access_token", tokens.access_token, {
      path: "/",
      domain: request.hostname,
      expires: new Date(Date.now() + (tokens.expires_in * 1000)),
      httpOnly: true,
      sameSite: "strict",
      signed: true,
      secure: "auto"
    })

    response.setCookie("refresh_token", tokens.refresh_token, {
      path: "/",
      domain: request.hostname,
      expires: new Date(Date.now() + (7 * 24 * 3600 * 1000)),
      httpOnly: true,
      sameSite: "strict",
      signed: true,
      secure: "auto"
    })

    response.redirect("/")
  }
}

export default AuthController
