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

import ComponentConfigApi from './ComponentConfigApi';

describe('ComponentConfigApi', () => {
    beforeEach(() => {
        mockCall.mockReset();
        vi.mocked(HeaderProperties.getXnin).mockReturnValue('12345678901');
        mockCall.mockResolvedValue({ success: true, data: [] });
    });

    it('getComponentConfigs calls expected endpoint with headers', async () => {
        await ComponentConfigApi.getComponentConfigs();

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: '/api/components/configurations',
            functionName: 'getComponentConfigs',
            customErrorMessage: 'Kunne ikke hente komponentkonfigurasjoner',
            customSuccessMessage: 'Komponentkonfigurasjoner ble hentet.',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });
});
