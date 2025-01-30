import { routes } from "./views";

const server = Bun.serve({
    async fetch(req) { // Listen for any request from the browser
        const url = new URL(req.url); // Convert the request into an URL object
        const path = url.pathname; // Retreive the path name

        // Serve static files (CSS, JS, images)
        if (path.startsWith("/assets/")) {
            return new Response(Bun.file(`./frontend/${path}`));
        }

        // If the route is not a static file that mean it must be a view
        // so we must check if there is a view function assigned.
        if (routes[path]) {
            // If there is a view function assigned we should execute that and return the reponse
            const view = routes[path];
            return view(req);
        }

        // Otherwise return a 404 not found to the user
        return new Response("Not Found", { status: 404 });
    },
});

console.log(`Listening on ${server.url}`);