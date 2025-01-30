import ejs from 'ejs';

const server = Bun.serve({
    async fetch(req) {
        const url = new URL(req.url);
        const path = url.pathname;

        // Serve static files (CSS, JS, images)
        if (path.startsWith("/assets/")) {
            return new Response(Bun.file(`./frontend/${path}`));
        }

        const data = {
            user: {
                is_authenticated: false,
            }
        };

        // Serve HTML files manually to prevent Bun's bundling interference
        const routes: Record<string, string> = {
            "/": "./frontend/index.html",
            "/products": "./frontend/product_index.html",
            "/products/:id": "./frontend/product.html",
            "/profile": "./frontend/profile.html",
        };

        if (routes[path]) {
            // Read the EJS template and render it with the data
            const templatePath = routes[path];
            const html = await ejs.renderFile(templatePath, data);

            return new Response(html, {
                headers: { "Content-Type": "text/html" },
            });
        }

        return new Response("Not Found", { status: 404 });
    },
});

console.log(`Listening on ${server.url}`);