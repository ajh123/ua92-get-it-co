import ejs from 'ejs';

export async function render(path: string, data: object) {
    const html = await ejs.renderFile(path, data);

    return new Response(html, {
        headers: { "Content-Type": "text/html" },
    });
}

export type ViewArgs = Record<string, string>;

export type Route = (req: Request, params?: ViewArgs) => Promise<Response>;