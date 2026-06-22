import { beforeEach, describe, expect, it, vi } from 'vitest';

import ClientApi from '~/api/ClientApi';
import ComponentApi from '~/api/ComponentApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { loader } from './loaders';

vi.mock('~/api/AccessApi');
vi.mock('~/api/ClientApi');
vi.mock('~/api/ComponentApi');
vi.mock('~/utils/selectedOrganization');

describe('klienter detail loader', () => {
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

        const request = new Request('http://localhost/klienter/123');
        const response = (await loader({ request, params: { id: '123' } } as any)) as Response;
        const data = await response.json();

        expect(getSelectedOrganization).toHaveBeenCalledWith(request);
        expect(ClientApi.getClientById).toHaveBeenCalledWith('org1', '123');
        expect(ComponentApi.getAllComponents).toHaveBeenCalledTimes(1);

        expect(data.client).toEqual({ data: { id: '123' } });
        expect(data.components).toEqual(['component1']);
        expect(data.access).toBeUndefined();
        expect(data.accessComponentList).toBeUndefined();
        expect(data.accessAuditLogs).toBeNull();
        expect(data.accessLog).toBeNull();
        expect(data.hasAccessControl).toBe(false);
    });

    it('uses empty id when params.id is missing', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('org1');
        vi.mocked(ClientApi.getClientById).mockResolvedValue({ data: null } as any);
        vi.mocked(ComponentApi.getAllComponents).mockResolvedValue({ data: [] } as any);

        const request = new Request('http://localhost/klienter');
        await loader({ request, params: {} } as any);

        expect(ClientApi.getClientById).toHaveBeenCalledWith('org1', '');
    });
});
