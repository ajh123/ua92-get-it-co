/**
 * This page is responsible for allowing the user to login when ever they want.
 * This is achieved by redirecting the user to the authentication provider (client).
 * The authentication provider will send the user back to us once they have logged in.
 */

import type { APIRoute } from "astro"
import { client } from "../auth"

export const GET: APIRoute = async (ctx) => {
	const { url } = await client.authorize(
		// We must construct a URL which represents where the authentication provider should send users once they log in.
		// This URL is located in this application not the authentication provider so must include the current origin in the URL.
		new URL(ctx.request.url).origin + "/callback",
		"code",
	)
	return Response.redirect(url, 302)
}