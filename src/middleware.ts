/**
 * From "https://github.com/openauthjs/openauth/blob/master/examples/client/astro/src/middleware.ts" ACCESSED=01/02/2025
 * 
 * The purpose of this file is to establish middleware on the backend. When a user accesses a page, this middleware will run first.
 * So we can use this file to perform necessary authentication functions and cookie token handling.
 * 
 * The original file was modified so that users are not forced to authenticate by default, unless they access the profile page.
 */

import { defineMiddleware } from "astro:middleware"
import { subjects, type User } from "./subjects"
import { client, setTokens } from "./auth"
import type { AstroCookies } from "astro"

export const onRequest = defineMiddleware(async (ctx, next) => {
	// Authentication callbacks must be automatically handled since the user is not logged in yet
	if (ctx.routePattern === "/callback") {
		return next()
	}

	try {
		// If we have an access token that means the user has already logged in.
		const accessToken = ctx.cookies.get("access_token")
		if (accessToken) {
			// We then get the refresh token and verify it against the access token,
			// this request will be passed to the authentication provider who will
			// automatically produce new tokens if this is a success.
			const refreshToken = ctx.cookies.get("refresh_token")
			const verified = await client.verify(subjects, accessToken.value, {
				refresh: refreshToken?.value,
			})
			// If there are no errors then we can updated our currently stored tokens and
			// user data (subject) to the new values.
			// Ignore any TypeScript errors in this block as TypeScript is being too strict
			// and it does not understand the actual logic.
			if (!verified.err) {
				if (verified.tokens)
					setTokens(ctx, verified.tokens.access, verified.tokens.refresh)
				ctx.locals.subject = verified.subject
				return next()
			} else {
				console.error(verified.err)
			}
		}
	} catch (e) {
		console.error(e)
	}

	// Only force authentication if we are trying to access the profile page.
	if (ctx.routePattern === "/profile" || ctx.routePattern === "/cart") {
		const { url } = await client.authorize(
			new URL(ctx.request.url).origin + "/callback",
			"code",
		)
		return Response.redirect(url, 302)
	}
	return next()
})


/**
 * This function will use an access token and use it to fetch user information from
 * the authentication provider.
 * 
 * The authentication provider will return the user information or `undefined` in a
 * JSON response.
 * 
 * @param cookies The cookies that are part of the user's request.
 * @returns The user data or `undefined`
 */
export async function getUser(cookies: AstroCookies): Promise<User|undefined> {
	// Return nothing if the access token is empty
	if (!cookies.has("access_token")) {
		return undefined;
	}

	const access = cookies.get("access_token").value;

	// Make a request to the authentication provider and pass the access token in the headers.
	const response = await fetch("https://authserver.minersonline.uk/userinfo", {
		headers: { Authorization: `Bearer ${access}` },
	})

	// Read the response from the request
	const body = (await response.text());

	// Convert into a JS object with JSON
	const data = JSON.parse(body);

	if (data == undefined) {
		return undefined;
	}

	return data as User;
}