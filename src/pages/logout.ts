/**
 * This file will process all logout requests by deleting any authentication tokens
 * and redirecting back to the home page.
 */

import type { APIRoute } from "astro"

export const GET: APIRoute = async (ctx) => {
    const headers = new Headers()

    headers.append("Set-Cookie", "refresh_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT")
    headers.append("Set-Cookie", "access_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT")

    headers.set("Location", "/")

    return new Response(null, { status: 302, headers })
}