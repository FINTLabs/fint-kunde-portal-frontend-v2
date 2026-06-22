import { beforeEach, describe, expect, it, vi } from 'vitest';

import AccessApi from '~/api/AccessApi';

import { loader } from './route';

vi.mock('~/api/AccessApi');

describe('tilgang resource loader', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns resource and field list', async () => {
        const resource = {
            name: 'elev',
            enabled: true,
            writeable: false,
            readingOption: 'MULTIPLE',
        };
        const fieldList = [{ name: 'systemId', enabled: true, mustContain: '', relation: false }];

        vi.mocked(AccessApi.getResourceAccess).mockResolvedValue({ data: resource } as any);
        vi.mocked(AccessApi.getFieldAccess).mockResolvedValue({ data: fieldList } as any);

        const response = (await loader({
            params: {
                id: 'client-a@client.fint.no',
                component: 'utdanning-elev',
                resource: 'elev',
            },
        } as any)) as Response;
        const data = await response.json();

        expect(AccessApi.getResourceAccess).toHaveBeenCalledWith(
            'client-a@client.fint.no',
            'utdanning-elev',
            'elev'
        );
        expect(AccessApi.getFieldAccess).toHaveBeenCalledWith(
            'client-a@client.fint.no',
            'utdanning-elev',
            'elev'
        );
        expect(data).toEqual({
            clientOrAdapter: 'client-a@client.fint.no',
            componentName: 'utdanning-elev',
            resource,
            fieldList,
        });
    });

    it('uses empty strings when params are missing', async () => {
        vi.mocked(AccessApi.getResourceAccess).mockResolvedValue({ data: null } as any);
        vi.mocked(AccessApi.getFieldAccess).mockResolvedValue({ data: [] } as any);

        await loader({ params: {} } as any);

        expect(AccessApi.getResourceAccess).toHaveBeenCalledWith('', '', '');
        expect(AccessApi.getFieldAccess).toHaveBeenCalledWith('', '', '');
    });
});
