import type { User } from "./storage/types";

export function generateSessionId(): string {
    return Math.random().toString(36).substring(2);
}

export const sessions: { [key: string]: User } = {};

export function setSession(sessionId: string, user: User) {
    sessions[sessionId] = user;
}

export function getSession(sessionId: string): User | undefined {
    return sessions[sessionId];
}

export function parseCookies(req: Request) {
    const cookieHeader = req.headers.get("cookie") || '';
    const cookies: { [key: string]: string } = {};
    cookieHeader.split(';').forEach(cookie => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        cookies[name] = value;
    });
    return cookies;
}

export function getCurrentUser(req: Request) {
    const cookies = parseCookies(req);
    const sessionId = cookies['sessionId'];
    return getSession(sessionId);
}

export function logoutUser(req: Request) {
    const cookies = parseCookies(req);
    const sessionId = cookies['sessionId'];
    delete sessions[sessionId];
}