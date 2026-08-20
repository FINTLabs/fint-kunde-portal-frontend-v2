import { describe, expect, it } from 'vitest';

import { parseTheme, selectOrgCookie, THEME_STORAGE_KEY, themeCookie } from './cookie';

describe('selectOrgCookie', () => {
    it('serializes and parses organisation value', async () => {
        const cookie = await selectOrgCookie.serialize('fint-org');

        expect(await selectOrgCookie.parse(cookie)).toBe('fint-org');
    });

    it('returns null when cookie header is missing', async () => {
        expect(await selectOrgCookie.parse(null)).toBeNull();
    });
});

describe('themeCookie', () => {
    it('uses the same key as theme localStorage', () => {
        expect(THEME_STORAGE_KEY).toBe('novari-theme');
    });

    it('serializes and parses theme value', async () => {
        const cookie = await themeCookie.serialize('dark');

        expect(await themeCookie.parse(cookie)).toBe('dark');
    });
});

describe('parseTheme', () => {
    it('returns dark only for the dark value', () => {
        expect(parseTheme('dark')).toBe('dark');
        expect(parseTheme('light')).toBe('light');
        expect(parseTheme(null)).toBe('light');
        expect(parseTheme('nope')).toBe('light');
    });
});
