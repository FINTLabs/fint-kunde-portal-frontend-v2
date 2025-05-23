// utils/cookies.js
import { createCookie } from '@remix-run/node'; // or "@remix-run/cloudflare"

export const selectOrgCookie = createCookie('organisation', {
    maxAge: 60 * 60 * 24 * 14, // 2 weeks in seconds
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
});
