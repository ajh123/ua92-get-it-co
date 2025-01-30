import { routes } from "./views";
import { match } from 'path-to-regexp';

const findRoute = (path: string) => {
    for (const route in routes) {
        const matcher = match(route, { decode: decodeURIComponent });
        const matched = matcher(path);
        if (matched) {
            return { view: routes[route], params: matched.params };
        }
    }
    return null;
};

const isRecordStringString = (obj: any): obj is Record<string, string> => {
    if (typeof obj !== 'object' || obj === null) return false;
    return Object.values(obj).every(value => typeof value === 'string');
};

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
        const result = findRoute(path);
        if (result) {
            const { view, params } = result;
            if (params && isRecordStringString(params)) {
                return view(req, params);
            } else {
                return view(req);
            }
        }

        // Otherwise return a 404 not found to the user
        return new Response("Not Found", { status: 404 });
    },
});

console.log(`Listening on ${server.url}`);