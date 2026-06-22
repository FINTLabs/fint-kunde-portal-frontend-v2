import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HeaderProperties } from '~/utils/headerProperties';

const { mockCall } = vi.hoisted(() => {
    return {
        mockCall: vi.fn(),
    };
});

vi.mock('novari-frontend-components', () => {
    class MockNovariApiManager {
        call = mockCall;
    }

    return {
        NovariApiManager: MockNovariApiManager,
    };
});

vi.mock('~/utils/headerProperties', () => ({
    HeaderProperties: {
        getXnin: vi.fn(),
    },
}));

import MeApi from './MeApi';

describe('MeApi', () => {
    beforeEach(() => {
        mockCall.mockReset();
        vi.mocked(HeaderProperties.getXnin).mockReturnValue('12345678901');
    });

    it('fetchMe returns user data when response succeeds', async () => {
        const meData = { name: 'Test User' };
        mockCall.mockResolvedValue({ success: true, data: meData });

        const result = await MeApi.fetchMe();

        expect(result).toEqual(meData);
        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: '/api/me',
            functionName: 'fetchMe',
            customErrorMessage: 'Kunne ikke hente brukerdata',
            customSuccessMessage: 'Brukerdata hentet',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('fetchMe throws 406 response for missing user', async () => {
        mockCall.mockResolvedValue({ success: false, status: 404 });

        await expect(MeApi.fetchMe()).rejects.toMatchObject({
            status: 406,
            statusText: 'Du har ikke opprettet bruker.',
        });
    });

    it('fetchMe throws 500 response when no user data is found', async () => {
        mockCall.mockResolvedValue({ success: false, status: 500 });

        await expect(MeApi.fetchMe()).rejects.toMatchObject({
            status: 500,
            statusText: 'Ingen brukerdata funnet',
        });
    });

    it('fetchOrganisations returns organisations when response succeeds with data', async () => {
        const organisations = [{ name: 'fint-org' }];
        mockCall.mockResolvedValue({ success: true, data: organisations });

        const result = await MeApi.fetchOrganisations();

        expect(result).toEqual(organisations);
        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: '/api/contacts/organisations',
            functionName: 'fetchOrganisations',
            customErrorMessage: 'Kunne ikke hente organisasjoner',
            customSuccessMessage: 'Organisasjoner hentet',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('fetchOrganisations throws 401 response when user has no organisations', async () => {
        mockCall.mockResolvedValue({ success: true, data: [] });

        await expect(MeApi.fetchOrganisations()).rejects.toMatchObject({
            status: 401,
            statusText: 'Du er ikke tilknyttet en organisasjon',
        });
    });
});
