import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import LinkWalkerIntegrationApi from './LinkWalkerIntegrationApi';
import type { LatestReportSummary, PagedRows } from '~/types/LinkWalkerIntegration';

const LINKWALKER_API_URL = 'http://localhost:8086';

const mockSummary: LatestReportSummary = {
    scanCompletedAt: '2026-05-07T10:30:00Z',
    orgId: 'agderfk_no',
    components: ['utdanning_elev'],
    summary: {
        totalRecords: 15000,
        totalRefs: 45000,
        brokenLinkCount: 36,
        integrityPercent: 99.92,
        byProblemType: {
            'missing-resource': 12,
            'unknown-link': 3,
        },
        components: [],
    },
};

const mockRows: PagedRows = {
    rows: [
        {
            orgId: 'agderfk_no',
            component: 'utdanning_elev',
            resource: 'elevforhold',
            problemType: 'missing-resource',
            sourceSelf: 'https://beta.felleskomponent.no/utdanning/elev/elevforhold/systemid/***MASKED***',
            targetHref: 'https://beta.felleskomponent.no/utdanning/elev/elev/feidenavn/***MASKED***',
            relationName: 'elev',
            expectedInverseName: null,
        },
    ],
    page: 0,
    size: 100,
    totalRows: 1,
    totalPages: 1,
};

const server = setupServer(
    http.get(`${LINKWALKER_API_URL}/report/:orgId/summary`, () => {
        return HttpResponse.json(mockSummary);
    }),
    http.get(`${LINKWALKER_API_URL}/report/:orgId/rows`, () => {
        return HttpResponse.json(mockRows);
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('LinkWalkerIntegrationApi', () => {
    describe('getSummary', () => {
        it('should fetch summary for an organization', async () => {
            const result = await LinkWalkerIntegrationApi.getSummary('agderfk_no');

            expect(result.data).toEqual(mockSummary);
            expect(result.data?.orgId).toBe('agderfk_no');
            expect(result.data?.summary.brokenLinkCount).toBe(36);
        });

        it('should handle 404 for unknown organization', async () => {
            server.use(
                http.get(`${LINKWALKER_API_URL}/report/:orgId/summary`, () => {
                    return new HttpResponse(null, { status: 404 });
                })
            );

            const result = await LinkWalkerIntegrationApi.getSummary('unknown_org');

            expect(result.status).toBe(404);
        });
    });

    describe('getRows', () => {
        it('should fetch rows for an organization', async () => {
            const result = await LinkWalkerIntegrationApi.getRows({
                orgId: 'agderfk_no',
            });

            expect(result.data).toEqual(mockRows);
            expect(result.data?.rows.length).toBe(1);
        });

        it('should apply filters correctly', async () => {
            const result = await LinkWalkerIntegrationApi.getRows({
                orgId: 'agderfk_no',
                component: 'utdanning_elev',
                resource: 'elevforhold',
                problemType: 'missing-resource',
                page: 0,
                size: 10,
            });

            expect(result.data?.rows.length).toBe(1);
            expect(result.data?.rows[0].component).toBe('utdanning_elev');
        });

        it('should handle pagination parameters', async () => {
            const result = await LinkWalkerIntegrationApi.getRows({
                orgId: 'agderfk_no',
                page: 2,
                size: 50,
            });

            expect(result.data?.page).toBe(0);
            expect(result.data?.size).toBe(100);
        });
    });
});
