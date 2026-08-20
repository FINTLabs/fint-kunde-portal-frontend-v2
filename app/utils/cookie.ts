import { createCookie } from 'react-router'; // or "@remix-run/cloudflare"

export type ThemeName = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'novari-theme';

export const selectOrgCookie = createCookie('organisation', {
    maxAge: 60 * 60 * 24 * 14, // 2 weeks in seconds
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
});

export const themeCookie = createCookie(THEME_STORAGE_KEY, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
});

export function parseTheme(value: unknown): ThemeName {
    return value === 'dark' ? 'dark' : 'light';
}
