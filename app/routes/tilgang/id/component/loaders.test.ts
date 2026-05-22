import { beforeEach, describe, expect, it, vi } from 'vitest';

import AccessApi from '~/api/AccessApi';

import { loader } from './route';

vi.mock('~/api/AccessApi');

function makeAccessComponent(name: string, enabled = false) {
    return {
        name,
        enabled,
        writeable: false,
        readingOption: 'MULTIPLE' as const,
        fields: [],
    };
}

describe('tilgang component loader', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns client, component and resource list', async () => {
        const resourceList = [makeAccessComponent('elev'), makeAccessComponent('person')];
        vi.mocked(AccessApi.getComponentAccess).mockResolvedValue({
            data: resourceList,
        } as any);

        const response = (await loader({
            params: { id: 'client-a@client.fint.no', component: 'utdanning-elev' },
        } as any)) as Response;
        const data = await response.json();

        expect(AccessApi.getComponentAccess).toHaveBeenCalledWith(
            'utdanning-elev',
            'client-a@client.fint.no'
        );
        expect(data).toEqual({
            clientOrAdapter: 'client-a@client.fint.no',
            resourceList,
            component: 'utdanning-elev',
        });
    });

    it('uses empty strings when params are missing', async () => {
        vi.mocked(AccessApi.getComponentAccess).mockResolvedValue({ data: [] } as any);

        await loader({ params: {} } as any);

        expect(AccessApi.getComponentAccess).toHaveBeenCalledWith('', '');
    });
});
