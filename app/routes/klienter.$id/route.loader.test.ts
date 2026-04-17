// integration test
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loader } from './route';
import ClientApi from '~/api/ClientApi';
import ComponentApi from '~/api/ComponentApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

vi.mock('~/api/AccessApi');
vi.mock('~/api/ClientApi');
vi.mock('~/api/ComponentApi');
vi.mock('~/utils/selectedOrganization');

describe('loader', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns client and components when access control is disabled', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('org1');

        vi.mocked(ClientApi.getClientById).mockResolvedValue({
            data: { id: '123' },
        } as any);

        vi.mocked(ComponentApi.getAllComponents).mockResolvedValue({
            data: ['component1'],
        } as any);

        const request = new Request('http://localhost');
        const params = { id: '123' };

        const response = await loader({ request, params } as any);
        const data = await response.json();

        expect(data.client).toEqual({ data: { id: '123' } });
        expect(data.components).toEqual(['component1']);

        expect(data.access).toBeUndefined();
        expect(data.hasAccessControl).toBe(false);

        expect(ClientApi.getClientById).toHaveBeenCalledWith('org1', '123');
        expect(ComponentApi.getAllComponents).toHaveBeenCalled();
    });
});
