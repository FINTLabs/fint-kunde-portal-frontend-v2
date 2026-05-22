import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('~/utils/cookie', () => ({
    selectOrgCookie: {
        parse: vi.fn(),
    },
}));

import { selectOrgCookie } from '~/utils/cookie';

import { getSelectedOrganization } from './selectedOrganization';

describe('getSelectedOrganization', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns organisation parsed from cookie header', async () => {
        vi.mocked(selectOrgCookie.parse).mockResolvedValue('fint-org');

        const request = new Request('http://localhost/ressurser', {
            headers: { Cookie: 'organisation=fint-org' },
        });

        const result = await getSelectedOrganization(request);

        expect(selectOrgCookie.parse).toHaveBeenCalledWith('organisation=fint-org');
        expect(result).toBe('fint-org');
    });

    it('passes null cookie header when request has no cookies', async () => {
        vi.mocked(selectOrgCookie.parse).mockResolvedValue(null);

        const result = await getSelectedOrganization(new Request('http://localhost/ressurser'));

        expect(selectOrgCookie.parse).toHaveBeenCalledWith(null);
        expect(result).toBeNull();
    });
});
