import { beforeEach, describe, expect, it, vi } from 'vitest';

import AdapterAPI from '~/api/AdapterApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { loader } from './loaders';

vi.mock('~/api/AdapterApi');
vi.mock('~/utils/selectedOrganization');

describe('adapter index loader', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns sorted adapters and selected organization', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(AdapterAPI.getAdapters).mockResolvedValue({
            data: [
                { name: 'b', shortDescription: 'Zulu' },
                { name: 'a', shortDescription: 'Alpha' },
            ],
        } as any);

        const request = new Request('http://localhost/adaptere');
        const response = (await loader({ request } as any)) as Response;
        const data = await response.json();

        expect(getSelectedOrganization).toHaveBeenCalledWith(request);
        expect(AdapterAPI.getAdapters).toHaveBeenCalledWith('fint-org');
        expect(data).toEqual({
            adapters: [
                { name: 'a', shortDescription: 'Alpha' },
                { name: 'b', shortDescription: 'Zulu' },
            ],
            orgName: 'fint-org',
        });
    });

    it('returns empty adapters list when API data is missing', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(AdapterAPI.getAdapters).mockResolvedValue({ data: undefined } as any);

        const request = new Request('http://localhost/adaptere');
        const response = (await loader({ request } as any)) as Response;
        const data = await response.json();

        expect(data).toEqual({
            adapters: [],
            orgName: 'fint-org',
        });
    });

    it('rethrows when AdapterAPI.getAdapters fails', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(AdapterAPI.getAdapters).mockRejectedValue(new Error('boom'));

        const request = new Request('http://localhost/adaptere');

        await expect(loader({ request } as any)).rejects.toThrow('boom');
    });
});
