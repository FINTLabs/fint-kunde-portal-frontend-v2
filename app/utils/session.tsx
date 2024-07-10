import { createCookieSessionStorage } from '@remix-run/node';

//TODO: double check if this cookie is secure
export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
    cookie: {
        name: 'user-session',
        // other cookie options like domain, path, httpOnly, etc.
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    },
});
