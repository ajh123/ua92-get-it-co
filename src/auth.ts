/** From "https://github.com/openauthjs/openauth/blob/master/examples/client/astro/src/auth.ts" ACCESSED=01/02/2025
 * 
 * The purpose of this file is to establish a connection with the authentication provider
 * and provide some useful functions
 */

import { createClient } from "@openauthjs/openauth/client"
import type { APIContext } from "astro"

// This is the code responsible for creating a connection with the authentication provider,
// we must supply out client ID and the URL to the authentication provider (issuer).
export const client = createClient({
  clientID: "get-it-co",
  issuer: "https://authserver.minersonline.uk",
})

// This function takes an access and refresh token and creates new cookies from them,
// these cookies are stored by the browser so the backend can identify the current user.
export function setTokens(ctx: APIContext, access: string, refresh: string) {
    ctx.cookies.set("refresh_token", refresh, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 34560000,
    })
    ctx.cookies.set("access_token", access, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 34560000,
    })
}

// We need a way to delete the tokens so we can logout.
export function deleteTokens(ctx: APIContext) {
    ctx.cookies.delete("refresh_token")
    ctx.cookies.delete("access_token")
}
