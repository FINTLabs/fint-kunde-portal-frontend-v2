import { beforeEach, describe, expect, it, vi } from 'vitest';

import AdapterApi from '~/api/AdapterApi';
import ComponentApi from '~/api/ComponentApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { loader } from './loaders';

vi.mock('~/api/AdapterApi');
vi.mock('~/api/ComponentApi');
vi.mock('~/utils/selectedOrganization');

describe('adapter loader', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns adapters, components and selected organization', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(AdapterApi.getAdapters).mockResolvedValue({
            data: [{ name: 'adapter-a' }],
        } as any);
        vi.mocked(ComponentApi.getAllComponents).mockResolvedValue({
            data: [{ name: 'component-a' }],
        } as any);

        const request = new Request('http://localhost/adapter/adapter-a');

        const response = await loader({ request } as any);
        const data = await response.json();

        expect(getSelectedOrganization).toHaveBeenCalledWith(request);
        expect(AdapterApi.getAdapters).toHaveBeenCalledWith('fint-org');
        expect(ComponentApi.getAllComponents).toHaveBeenCalled();
        expect(data).toEqual({
            adapters: [{ name: 'adapter-a' }],
            components: [{ name: 'component-a' }],
            orgName: 'fint-org',
        });
    });

    it('rethrows when AdapterApi.getAdapters fails', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(AdapterApi.getAdapters).mockRejectedValue(new Error('boom'));

        const request = new Request('http://localhost/adapter/adapter-a');

        await expect(loader({ request } as any)).rejects.toThrow('boom');
        expect(ComponentApi.getAllComponents).not.toHaveBeenCalled();
    });
});
