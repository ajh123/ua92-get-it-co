import ejs from 'ejs';

export async function render(path: string, data: object) {
    const html = await ejs.renderFile(path, data);

    return new Response(html, {
        headers: { "Content-Type": "text/html" },
    });
}