import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loader } from './loaders';

vi.mock('~/utils/selectedOrganization', () => ({
    getSelectedOrganization: vi.fn(async () => 'org-1'),
}));

vi.mock('~/api/ComponentApi', () => ({
    default: {
        getOrganisationComponents: vi.fn(async () => ({
            data: [{ basePath: '/a', description: 'A' }],
        })),
    },
}));

vi.mock('~/api/ClientApi', () => ({
    default: {
        getClients: vi.fn(async () => ({
            data: [
                { name: 'c1', managed: false },
                { name: 'c2', managed: true },
            ],
        })),
    },
}));
function makeLoaderArgs(request: Request) {
    return {
        request,
        params: {},
        context: {} as any,
        unstable_pattern: '/basistest',
    } as any;
}
describe('basistest loader', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns components and filters out managed clients', async () => {
        const request = new Request('http://localhost/basistest');

        const res = (await loader(makeLoaderArgs(request))) as Response;
        expect(res).toBeInstanceOf(Response);

        const json = await res.json();
        expect(json.components).toEqual([{ basePath: '/a', description: 'A' }]);
        expect(json.clients).toEqual([{ name: 'c1', managed: false }]);
    });
});
