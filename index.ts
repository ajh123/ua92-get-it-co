const server = Bun.serve({
    async fetch(req) {
        const url = new URL(req.url);
        const path = url.pathname;

        // Serve static files (CSS, JS, images)
        if (path.startsWith("/assets/")) {
            return new Response(Bun.file(`./frontend/${path}`));
        }

        // Serve HTML files manually to prevent Bun's bundling interference
        const routes: Record<string, string> = {
            "/": "./frontend/index.html",
            "/products": "./frontend/product_index.html",
            "/products/:id": "./frontend/product.html",
            "/profile": "./frontend/profile.html",
        };

        if (routes[path]) {
            return new Response(Bun.file(routes[path]), {
                headers: { "Content-Type": "text/html" },
            });
        }

        return new Response("Not Found", { status: 404 });
    },
});

console.log(`Listening on ${server.url}`);