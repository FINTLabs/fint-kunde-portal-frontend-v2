import { beforeEach, describe, expect, it, vi } from 'vitest';

import ClientApi from '~/api/ClientApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { loader } from './loaders';

vi.mock('~/api/ClientApi');
vi.mock('~/utils/selectedOrganization');

describe('klienter index loader', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns sorted clients, model version and selected organization', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(ClientApi.getClients).mockResolvedValue({
            data: [
                { name: 'b', shortDescription: 'Zulu' },
                { name: 'a', shortDescription: 'Alpha' },
            ],
        } as any);
        vi.mocked(ClientApi.getClientModelVersions).mockResolvedValue({
            data: { V3: 1, V4: 2 },
        } as any);

        const request = new Request('http://localhost/klienter');
        const response = (await loader({ request } as any)) as Response;
        const data = await response.json();

        expect(getSelectedOrganization).toHaveBeenCalledWith(request);
        expect(ClientApi.getClients).toHaveBeenCalledWith('fint-org');
        expect(ClientApi.getClientModelVersions).toHaveBeenCalledWith('fint-org');
        expect(data).toEqual({
            clientData: [
                { name: 'a', shortDescription: 'Alpha' },
                { name: 'b', shortDescription: 'Zulu' },
            ],
            modelVersion: { V3: 1, V4: 2 },
            orgName: 'fint-org',
        });
    });

    it('returns empty client list when API data is missing', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(ClientApi.getClients).mockResolvedValue({ data: undefined } as any);
        vi.mocked(ClientApi.getClientModelVersions).mockResolvedValue({ data: undefined } as any);

        const request = new Request('http://localhost/klienter');
        const response = (await loader({ request } as any)) as Response;
        const data = await response.json();

        expect(data).toEqual({
            clientData: [],
            modelVersion: undefined,
            orgName: 'fint-org',
        });
    });

    it('rethrows when ClientApi.getClients fails', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(ClientApi.getClients).mockRejectedValue(new Error('boom'));

        const request = new Request('http://localhost/klienter');

        await expect(loader({ request } as any)).rejects.toThrow('boom');
    });
});
