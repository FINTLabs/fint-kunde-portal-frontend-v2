import { beforeEach, describe, expect, it, vi } from 'vitest';

import AnalyticsApi from '~/api/AnalyticsApi';
import ClientApi from '~/api/ClientApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { handleClientIndexAction } from './actions';

vi.mock('~/api/AnalyticsApi', () => ({
    default: {
        trackActionError: vi.fn(),
        trackActionEvent: vi.fn(),
    },
}));

vi.mock('~/api/ClientApi');
vi.mock('~/utils/selectedOrganization');

describe('handleClientIndexAction', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    function createRequest(formData: Record<string, string>): Request {
        const body = new URLSearchParams(formData);
        return new Request('http://localhost/klienter', {
            method: 'POST',
            body,
        });
    }

    it('creates client and redirects on success', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(ClientApi.createClient).mockResolvedValue({
            success: true,
            data: { name: 'my-client@client.fint.no' },
        } as any);

        const request = createRequest({
            name: 'my-client@client.fint.no',
            description: 'Kort beskrivelse',
            note: 'Detaljert info',
            modelVersion: 'V4',
        });

        const response = await handleClientIndexAction({ request });

        expect(getSelectedOrganization).toHaveBeenCalledWith(request);
        expect(ClientApi.createClient).toHaveBeenCalledWith(
            {
                name: 'my-client@client.fint.no',
                shortDescription: 'Kort beskrivelse',
                note: 'Detaljert info',
                modelVersion: 'V4',
            },
            'fint-org'
        );
        expect(AnalyticsApi.trackActionEvent).toHaveBeenCalledWith({
            path: '/klienter',
            type: 'action',
            element: 'client-create-action',
            tenant: 'fint-org',
        });
        expect(response).toBeInstanceOf(Response);
        expect(response.status).toBe(302);
        expect(response.headers.get('Location')).toBe('/klienter/my-client@client.fint.no');
    });

    it('throws 409 response when client already exists', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(ClientApi.createClient).mockResolvedValue({
            success: false,
            status: 409,
        } as any);

        const request = createRequest({
            name: 'existing-client',
            description: 'Kort beskrivelse',
            note: 'Detaljert info',
            modelVersion: 'V3',
        });

        await expect(handleClientIndexAction({ request })).rejects.toMatchObject({
            status: 409,
        });
        expect(AnalyticsApi.trackActionError).toHaveBeenCalledWith(
            '/klienter',
            'Klienten eksisterer allerede.',
            409,
            'fint-org'
        );
        expect(AnalyticsApi.trackActionEvent).not.toHaveBeenCalled();
    });

    it('throws 500 response when client creation fails', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(ClientApi.createClient).mockResolvedValue({
            success: false,
            status: 500,
        } as any);

        const request = createRequest({
            name: 'my-client',
            description: 'Kort beskrivelse',
            note: 'Detaljert info',
            modelVersion: 'V3',
        });

        await expect(handleClientIndexAction({ request })).rejects.toMatchObject({
            status: 500,
        });
        expect(AnalyticsApi.trackActionError).toHaveBeenCalledWith(
            '/klienter',
            'Kunne ikke opprette ny klient.',
            500,
            'fint-org'
        );
    });
});
