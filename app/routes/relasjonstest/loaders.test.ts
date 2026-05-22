import { beforeEach, describe, expect, it, vi } from 'vitest';

import ComponentApi from '~/api/ComponentApi';
import ComponentConfigApi from '~/api/ComponentConfigApi';
import LinkWalkerApi from '~/api/LinkWalkerApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { loader } from './loaders';

vi.mock('~/api/ComponentApi');
vi.mock('~/api/ComponentConfigApi');
vi.mock('~/api/LinkWalkerApi');
vi.mock('~/utils/selectedOrganization');

describe('relasjonstest loader', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns components, configs and relation tests', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(ComponentApi.getOrganisationComponents).mockResolvedValue({
            data: [{ name: 'comp-1', description: 'Comp 1' }],
        } as any);
        vi.mocked(ComponentConfigApi.getComponentConfigs).mockResolvedValue({
            data: [{ dn: 'dn-comp-1', path: '/utdanning' }],
        } as any);
        vi.mocked(LinkWalkerApi.getTests).mockResolvedValue({
            data: [{ id: 'test-1', status: 'COMPLETED' }],
        } as any);

        const request = new Request('http://localhost/relasjonstest');
        const response = (await loader({ request } as any)) as Response;
        const data = await response.json();

        expect(getSelectedOrganization).toHaveBeenCalledWith(request);
        expect(ComponentApi.getOrganisationComponents).toHaveBeenCalledWith('fint-org');
        expect(ComponentConfigApi.getComponentConfigs).toHaveBeenCalledTimes(1);
        expect(LinkWalkerApi.getTests).toHaveBeenCalledWith('fint-org');
        expect(data).toEqual({
            components: [{ name: 'comp-1', description: 'Comp 1' }],
            relationTests: [{ id: 'test-1', status: 'COMPLETED' }],
            configs: [{ dn: 'dn-comp-1', path: '/utdanning' }],
            success: false,
            message: 'Oppdatering av testresultater',
            variant: 'success',
        });
    });

    it('rethrows when LinkWalkerApi.getTests fails', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(ComponentApi.getOrganisationComponents).mockResolvedValue({ data: [] } as any);
        vi.mocked(ComponentConfigApi.getComponentConfigs).mockResolvedValue({ data: [] } as any);
        vi.mocked(LinkWalkerApi.getTests).mockRejectedValue(new Error('boom'));

        await expect(
            loader({ request: new Request('http://localhost/relasjonstest') } as any)
        ).rejects.toThrow('boom');
    });
});
