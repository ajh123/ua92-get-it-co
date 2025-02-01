/**
 * This file will process all logout requests by deleting any authentication tokens
 * and redirecting back to the home page.
 */

import type { APIRoute } from "astro"

export const GET: APIRoute = async (ctx) => {
    ctx.cookies.delete("refresh_token")
    ctx.cookies.delete("access_token")
	return Response.redirect("/", 302)
}