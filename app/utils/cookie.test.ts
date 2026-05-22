import { describe, expect, it } from 'vitest';

import { selectOrgCookie } from './cookie';

describe('selectOrgCookie', () => {
    it('serializes and parses organisation value', async () => {
        const cookie = await selectOrgCookie.serialize('fint-org');

        expect(await selectOrgCookie.parse(cookie)).toBe('fint-org');
    });

    it('returns null when cookie header is missing', async () => {
        expect(await selectOrgCookie.parse(null)).toBeNull();
    });
});
