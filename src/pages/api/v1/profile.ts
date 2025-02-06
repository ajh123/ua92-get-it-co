import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
    if (!cookies.has("access_token")) {
        return new Response('Unauthorized - No token found', { status: 401 });
    }

    const access_token = cookies.get('access_token'); // Access token from cookie

    // Extract form data from the request body
    const formData = new URLSearchParams(await request.text());

    // Forward the request to the auth server
    await fetch('https://authserver.minersonline.uk/userinfo', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${access_token.value}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData, // Forward the original body to the auth server
    });

    // Return the user back to their profile
    
    return Response.redirect(`${(new URL(request.url)).origin}/profile`, 301)
};