import { beforeEach, describe, expect, it, vi } from 'vitest';

import ComponentApi from '~/api/ComponentApi';
import ComponentConfigApi from '~/api/ComponentConfigApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { loader } from './loaders';

vi.mock('~/api/ComponentApi');
vi.mock('~/api/ComponentConfigApi');
vi.mock('~/utils/selectedOrganization');

describe('hendelseslogg loader', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns components and configs', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');

        vi.mocked(ComponentApi.getOrganisationComponents).mockResolvedValue({
            data: [{ name: 'comp-1', description: 'Comp 1' }],
        } as any);

        vi.mocked(ComponentConfigApi.getComponentConfigs).mockResolvedValue({
            data: [{ dn: 'dn=comp-1', classes: [] }],
        } as any);

        const request = new Request('http://localhost/hendelseslogg');
        const response = (await loader({ request } as any)) as Response;
        const json = await response.json();

        expect(getSelectedOrganization).toHaveBeenCalledWith(request);
        expect(ComponentApi.getOrganisationComponents).toHaveBeenCalledWith('fint-org');
        expect(ComponentConfigApi.getComponentConfigs).toHaveBeenCalledTimes(1);

        expect(json).toEqual({
            components: [{ name: 'comp-1', description: 'Comp 1' }],
            configs: [{ dn: 'dn=comp-1', classes: [] }],
        });
    });
});
