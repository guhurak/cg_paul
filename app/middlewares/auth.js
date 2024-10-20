import DiscordAuth from "../services/discord_auth.js"

async function authMiddleware(request, response) {
  const discord_service = new DiscordAuth(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_CLIENT_SECRET)

  if (request.cookies.access_token == undefined && request.cookies.refresh_token == undefined) {
    return response.redirect("/auth/login")
  }

  if (request.cookies.access_token == undefined || global.server.unsignCookie(request.cookies.access_token).valid == false) {
    if (request.unsignCookie(request.cookies.refresh_token).valid == false) {
      return response.redirect("/auth/login")
    }

    const tokens = await discord_service.refresh_token(request.cookies.refresh_token)

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
  }
}

export default authMiddleware
