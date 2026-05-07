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
        getUsername: vi.fn(),
    },
}));

import AccessApi from './AccessApi';

describe('AccessApi', () => {
    beforeEach(() => {
        mockCall.mockReset();
        vi.mocked(HeaderProperties.getXnin).mockReturnValue('12345678901');
        vi.mocked(HeaderProperties.getUsername).mockReturnValue('jennifer');
    });

    it('getClientOrAdapterAccess calls access endpoint with headers', async () => {
        mockCall.mockResolvedValue({ success: true, data: {} });

        await AccessApi.getClientOrAdapterAccess('test-user');

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: '/access/test-user',
            functionName: 'getClientOrAdapterAccess',
            customErrorMessage: 'Kunne ikke hente tilgang for: test-user',
            customSuccessMessage: 'Tilgang for test-user ble hentet',
            additionalHeaders: {
                'x-nin': '12345678901',
                'x-portalUser': 'jennifer',
            },
        });
    });
});
