import { beforeEach, describe, expect, it, vi } from 'vitest';

import ComponentApi from '~/api/ComponentApi';

import { loader } from './route';

vi.mock('~/api/ComponentApi');

function makeComponent(overrides: Record<string, unknown> = {}) {
    return {
        dn: 'dn-comp-1',
        name: 'comp-1',
        description: 'Component 1',
        organisations: [],
        clients: [],
        adapters: [],
        basePath: '/comp-1',
        port: null,
        core: false,
        openData: false,
        common: false,
        cacheDisabledFor: [],
        inProduction: true,
        inBeta: false,
        inPlayWithFint: false,
        ...overrides,
    };
}

describe('komponenter detail loader', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns component when found by id', async () => {
        const component = makeComponent();
        vi.mocked(ComponentApi.getComponentById).mockResolvedValue(component as any);

        const response = (await loader({ params: { id: 'comp-1' } } as any)) as Response;
        const data = await response.json();

        expect(ComponentApi.getComponentById).toHaveBeenCalledWith('comp-1');
        expect(data).toEqual(component);
    });

    it('returns null when component is not found', async () => {
        vi.mocked(ComponentApi.getComponentById).mockResolvedValue(null);

        const response = (await loader({ params: { id: 'missing' } } as any)) as Response;
        const data = await response.json();

        expect(ComponentApi.getComponentById).toHaveBeenCalledWith('missing');
        expect(data).toBeNull();
    });

    it('uses empty id when params.id is missing', async () => {
        vi.mocked(ComponentApi.getComponentById).mockResolvedValue(null);

        await loader({ params: {} } as any);

        expect(ComponentApi.getComponentById).toHaveBeenCalledWith('');
    });

    it('rethrows when ComponentApi.getComponentById fails', async () => {
        vi.mocked(ComponentApi.getComponentById).mockRejectedValue(new Error('boom'));

        await expect(loader({ params: { id: 'comp-1' } } as any)).rejects.toThrow('boom');
    });
});
