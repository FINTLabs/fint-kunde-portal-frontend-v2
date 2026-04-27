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
        constructor(_: unknown) {}
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

import BasicTestApi from './BasicTestApi';

describe('BasicTestApi', () => {
    const orgName = 'fint-org';
    const baseUrl = 'https://example.no';
    const endpoint = '/api/resource';

    beforeEach(() => {
        mockCall.mockReset();
        vi.mocked(HeaderProperties.getXnin).mockReturnValue('12345678901');
        mockCall.mockResolvedValue({ success: true, data: {} });
    });

    it('runTest posts run request with clientName', async () => {
        await BasicTestApi.runTest(orgName, baseUrl, endpoint, 'client-a');

        expect(mockCall).toHaveBeenCalledWith({
            method: 'POST',
            endpoint: `/test-runner/${orgName}/run`,
            functionName: 'runBasicTest',
            body: JSON.stringify({
                baseUrl,
                endpoint,
                clientName: 'client-a',
            }),
            customErrorMessage: 'Kunne ikke kjøre basistesten',
            customSuccessMessage: 'Basistesten ble kjørt.',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('runTest omits clientName when empty', async () => {
        await BasicTestApi.runTest(orgName, baseUrl, endpoint, '');

        expect(mockCall).toHaveBeenCalledWith({
            method: 'POST',
            endpoint: `/test-runner/${orgName}/run`,
            functionName: 'runBasicTest',
            body: JSON.stringify({
                baseUrl,
                endpoint,
            }),
            customErrorMessage: 'Kunne ikke kjøre basistesten',
            customSuccessMessage: 'Basistesten ble kjørt.',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('runHealthTest posts health request with clientName', async () => {
        await BasicTestApi.runHealthTest(orgName, baseUrl, endpoint, 'client-a');

        expect(mockCall).toHaveBeenCalledWith({
            method: 'POST',
            endpoint: `/test-runner/${orgName}/health`,
            functionName: 'runHealthTest',
            body: JSON.stringify({
                baseUrl,
                endpoint,
                clientName: 'client-a',
            }),
            customErrorMessage: 'Kunne ikke kjøre helsesjekken',
            customSuccessMessage: 'Helsesjekken ble kjørt.',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('runHealthTest omits clientName when empty', async () => {
        await BasicTestApi.runHealthTest(orgName, baseUrl, endpoint, '');

        expect(mockCall).toHaveBeenCalledWith({
            method: 'POST',
            endpoint: `/test-runner/${orgName}/health`,
            functionName: 'runHealthTest',
            body: JSON.stringify({
                baseUrl,
                endpoint,
            }),
            customErrorMessage: 'Kunne ikke kjøre helsesjekken',
            customSuccessMessage: 'Helsesjekken ble kjørt.',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });
});
