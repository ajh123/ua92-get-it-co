/**
 * This file will process all logout requests by deleting any authentication tokens
 * and redirecting back to the home page.
 */

import type { APIRoute } from "astro"
import { deleteTokens } from "../auth"

export const GET: APIRoute = async (ctx) => {
	deleteTokens(ctx)
	return Response.redirect("/", 302)
}