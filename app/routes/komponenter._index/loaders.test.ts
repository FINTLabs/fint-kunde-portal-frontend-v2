import { beforeEach, describe, expect, it, vi } from 'vitest';

import ComponentApi from '~/api/ComponentApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { loader } from './loaders';

vi.mock('~/api/ComponentApi');
vi.mock('~/utils/selectedOrganization');

describe('komponenter index loader', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns components and selected organization', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(ComponentApi.getAllComponents).mockResolvedValue({
            data: [
                { name: 'comp-a', description: 'Component A' },
                { name: 'comp-b', description: 'Component B' },
            ],
        } as any);

        const request = new Request('http://localhost/komponenter');
        const response = (await loader({ request } as any)) as Response;
        const data = await response.json();

        expect(getSelectedOrganization).toHaveBeenCalledWith(request);
        expect(ComponentApi.getAllComponents).toHaveBeenCalledTimes(1);
        expect(data).toEqual({
            components: [
                { name: 'comp-a', description: 'Component A' },
                { name: 'comp-b', description: 'Component B' },
            ],
            orgName: 'fint-org',
        });
    });

    it('returns undefined components when API data is missing', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(ComponentApi.getAllComponents).mockResolvedValue({ data: undefined } as any);

        const request = new Request('http://localhost/komponenter');
        const response = (await loader({ request } as any)) as Response;
        const data = await response.json();

        expect(data).toEqual({
            components: undefined,
            orgName: 'fint-org',
        });
    });

    it('rethrows when ComponentApi.getAllComponents fails', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(ComponentApi.getAllComponents).mockRejectedValue(new Error('boom'));

        const request = new Request('http://localhost/komponenter');

        await expect(loader({ request } as any)).rejects.toThrow('boom');
    });
});
