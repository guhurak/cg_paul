import DiscordAuth from "../services/discord_auth.js"
import DiscordApi from "../services/discord_api.js"

async function auth_middleware(request, response) {
  const discord_service = new DiscordAuth(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_CLIENT_SECRET)

  let access_token

  if (request.cookies.access_token != undefined && global.server.unsignCookie(request.cookies.access_token).valid) {
    access_token = global.server.unsignCookie(request.cookies.access_token).value
  } else if (request.access_token != undefined) {
    access_token = request.access_token
  }

  let refresh_token

  if (request.cookies.refresh_token != undefined && global.server.unsignCookie(request.cookies.refresh_token).valid) {
    refresh_token = global.server.unsignCookie(request.cookies.refresh_token).value
  } else if (request.refresh_token != undefined) {
    refresh_token = request.refresh_token
  }

  if (refresh_token == undefined) {
    return response.redirect("/auth/login")
  }

  if (access_token == undefined) {
    const tokens = await discord_service.refresh_token(refresh_token)

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
  }

  let roles

  if (request.cookies.roles != undefined && global.server.unsignCookie(request.cookies.roles).valid) {
    roles = global.server.unsignCookie(request.cookies.roles).value
  } else if (request.roles != undefined) {
    roles = request.roles
  }

  if(roles == undefined || access_token == undefined || refresh_token == undefined) {
    const token = access_token == undefined ? request.access_token : access_token
    const api = new DiscordApi(token)

    const fresh_roles = await api.get_user_roles()

    response.setCookie("roles", fresh_roles.toString(), {
      path: "/",
      domain: request.hostname,
      expires: new Date(Date.now() + (7 * 24 * 3600 * 1000)),
      httpOnly: true,
      sameSite: "strict",
      signed: true,
      secure: "auto"
    })
    request.roles = fresh_roles
  }

  let user_id

  if (request.cookies.user_id != undefined && global.server.unsignCookie(request.cookies.user_id).valid) {
    user_id = global.server.unsignCookie(request.cookies.user_id).value
  } else if (request.user_id != undefined) {
    user_id = request.user_id
  }

  if (user_id == undefined || access_token == undefined || refresh_token == undefined) {
    const token = access_token == undefined ? request.access_token : access_token
    const api = new DiscordApi(token)

    const fresh_user_id = await api.get_user_id()

    response.setCookie("user_id", fresh_user_id.toString(), {
      path: "/",
      domain: request.hostname,
      expires: new Date(Date.now() + (7 * 24 * 3600 * 1000)),
      httpOnly: true,
      sameSite: "strict",
      signed: true,
      secure: "auto"
    })
    request.user_id = fresh_user_id
  }
}

export default auth_middleware
