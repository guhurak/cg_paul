import DiscordAuth from "../../services/discord_auth.js"
import DiscordApi from "../../services/discord_api.js"

class AuthController {
  constructor() {}

  login(request, response) {
    if (request.cookies.access_token != undefined) {
      return response.redirect("/")
    }

    console.log(response.locals)
    return response.view("auth/login", { title: "Login", auth_uri: process.env.DISCORD_AUTH_URI })
  }

  logout(request, response) {
    response.clearCookie("access_token", { domain: request.hostname, path: "/" })
    response.clearCookie("refresh_token", { domain: request.hostname, path: "/" })
    response.clearCookie("roles", { domain: request.hostname, path: "/" })

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
    request.access_token = tokens.access_token

    response.setCookie("refresh_token", tokens.refresh_token, {
      path: "/",
      domain: request.hostname,
      expires: new Date(Date.now() + (7 * 24 * 3600 * 1000)),
      httpOnly: true,
      sameSite: "strict",
      signed: true,
      secure: "auto"
    })
    request.refresh_token = tokens.refresh_token

    const api = new DiscordApi(tokens.access_token)

    const roles = await api.get_user_roles()

    response.setCookie("roles", roles.toString(), {
      path: "/",
      domain: request.hostname,
      expires: new Date(Date.now() + (tokens.expires_in * 1000)),
      httpOnly: true,
      sameSite: "strict",
      signed: true,
      secure: "auto"
    })
    request.roles = roles

    const user_id = await api.get_user_id()

    response.setCookie("user_id", user_id.toString(), {
      path: "/",
      domain: request.hostname,
      expires: new Date(Date.now() + (7 * 24 * 3600 * 1000)),
      httpOnly: true,
      sameSite: "strict",
      signed: true,
      secure: "auto"
    })
    request.user_id = user_id

    return response.view("auth/discord", { title: "Connecté" })
  }
}

export default AuthController
