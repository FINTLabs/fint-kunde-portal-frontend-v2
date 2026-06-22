import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HeaderProperties } from '~/utils/headerProperties';

const { mockCall } = vi.hoisted(() => {
    return {
        mockCall: vi.fn(),
    };
});

vi.mock('novari-frontend-components', () => {
    class MockNovariApiManager {
        call = mockCall;
    }

    return {
        NovariApiManager: MockNovariApiManager,
    };
});

vi.mock('~/utils/headerProperties', () => ({
    HeaderProperties: {
        getXnin: vi.fn(),
    },
}));

import LinkWalkerIntegrationApi from './LinkWalkerIntegrationApi';

describe('LinkWalkerIntegrationApi', () => {
    beforeEach(() => {
        mockCall.mockReset();
        vi.mocked(HeaderProperties.getXnin).mockReturnValue('12345678901');
        mockCall.mockResolvedValue({ success: true, data: {} });
    });

    describe('getSummary', () => {
        it('calls expected endpoint with headers', async () => {
            await LinkWalkerIntegrationApi.getSummary('calvin_organizations');

            expect(mockCall).toHaveBeenCalledWith({
                method: 'GET',
                endpoint: '/link-walker/report/calvin_organizations/summary',
                functionName: 'getSummary',
                customErrorMessage: 'Kunne ikke hente sammendrag for organisasjonen: calvin_organizations',
                customSuccessMessage: 'Sammendrag hentet',
                additionalHeaders: {
                    'x-nin': '12345678901',
                },
            });
        });
    });

    describe('getRows', () => {
        it('uses default pagination when not provided', async () => {
            await LinkWalkerIntegrationApi.getRows({
                orgId: 'calvin_organizations',
            });

            expect(mockCall).toHaveBeenCalledWith({
                method: 'GET',
                endpoint: '/link-walker/report/calvin_organizations/rows?page=0&size=100',
                functionName: 'getRows',
                customErrorMessage: 'Kunne ikke hente rader for organisasjonen: calvin_organizations',
                customSuccessMessage: 'Rader hentet',
                additionalHeaders: {
                    'x-nin': '12345678901',
                },
            });
        });

        it('includes filters and explicit pagination in query string', async () => {
            await LinkWalkerIntegrationApi.getRows({
                orgId: 'calvin_organizations',
                component: 'utdanning_elev',
                resource: 'elevforhold',
                problemType: 'missing-resource',
                page: 2,
                size: 50,
            });

            expect(mockCall).toHaveBeenCalledWith({
                method: 'GET',
                endpoint:
                    '/link-walker/report/calvin_organizations/rows?component=utdanning_elev&resource=elevforhold&problemType=missing-resource&page=2&size=50',
                functionName: 'getRows',
                customErrorMessage: 'Kunne ikke hente rader for organisasjonen: calvin_organizations',
                customSuccessMessage: 'Rader hentet',
                additionalHeaders: {
                    'x-nin': '12345678901',
                },
            });
        });
    });
});
