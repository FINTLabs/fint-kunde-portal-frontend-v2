import { beforeEach, describe, expect, it, vi } from 'vitest';

import LinkWalkerIntegrationApi from '~/api/LinkWalkerIntegrationApi';

import { loader } from './route';

vi.mock('~/api/LinkWalkerIntegrationApi');

function makeRow(overrides: Partial<ReturnType<typeof baseRow>> = {}) {
    return { ...baseRow(), ...overrides };
}

function baseRow() {
    return {
        orgId: 'afk_no',
        component: 'utdanning_elev',
        resource: 'elevforhold',
        problemType: 'missing-resource' as const,
        sourceSelf: 'https://example.com/source',
        targetHref: 'https://example.com/target',
        relationName: 'elev',
        expectedInverseName: 'elevforhold',
    };
}

describe('linkwalker broken loader', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns paged rows, filter rows and org name', async () => {
        const pagedRows = {
            rows: [makeRow()],
            page: 0,
            size: 10,
            totalRows: 1,
            totalPages: 1,
        };
        const filterRows = [makeRow(), makeRow({ component: 'utdanning_timeplan', resource: 'time' })];

        vi.mocked(LinkWalkerIntegrationApi.getRows)
            .mockResolvedValueOnce({ data: pagedRows } as any)
            .mockResolvedValueOnce({ data: { rows: filterRows } } as any);

        const request = new Request('http://localhost/linkwalker/broken?page=0&size=10');
        const data = await loader({ request } as any);

        expect(LinkWalkerIntegrationApi.getRows).toHaveBeenNthCalledWith(1, {
            orgId: 'afk_no',
            component: '',
            resource: '',
            problemType: undefined,
            page: 0,
            size: 10,
        });
        expect(LinkWalkerIntegrationApi.getRows).toHaveBeenNthCalledWith(2, {
            orgId: 'afk_no',
            page: 0,
            size: 1000,
        });
        expect(data).toEqual({
            pagedRows,
            filterRows,
            orgName: 'afk_no',
        });
    });

    it('passes filter search params to getRows', async () => {
        vi.mocked(LinkWalkerIntegrationApi.getRows)
            .mockResolvedValueOnce({
                data: { rows: [], page: 2, size: 25, totalRows: 0, totalPages: 0 },
            } as any)
            .mockResolvedValueOnce({ data: { rows: [] } } as any);

        const request = new Request(
            'http://localhost/linkwalker/broken?component=utdanning_elev&resource=elev&problemType=unknown-link&page=2&size=25'
        );
        await loader({ request } as any);

        expect(LinkWalkerIntegrationApi.getRows).toHaveBeenNthCalledWith(1, {
            orgId: 'afk_no',
            component: 'utdanning_elev',
            resource: 'elev',
            problemType: 'unknown-link',
            page: 2,
            size: 25,
        });
    });

    it('redirects when search params contain empty values', async () => {
        const request = new Request(
            'http://localhost/linkwalker/broken?component=&resource=elev&page=0'
        );
        const response = (await loader({ request } as any)) as Response;

        expect(response.status).toBe(302);
        expect(response.headers.get('Location')).toBe(
            'http://localhost/linkwalker/broken?resource=elev&page=0'
        );
        expect(LinkWalkerIntegrationApi.getRows).not.toHaveBeenCalled();
    });

    it('falls back to empty data when getRows fails', async () => {
        vi.mocked(LinkWalkerIntegrationApi.getRows)
            .mockRejectedValueOnce(new Error('boom'))
            .mockRejectedValueOnce(new Error('boom'));

        const request = new Request('http://localhost/linkwalker/broken?page=abc&size=xyz');
        const data = await loader({ request } as any);

        expect(data).toEqual({
            pagedRows: {
                rows: [],
                page: 0,
                size: 10,
                totalRows: 0,
                totalPages: 0,
            },
            filterRows: [],
            orgName: 'afk_no',
        });
    });
});
