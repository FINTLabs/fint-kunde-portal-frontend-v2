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

import FeaturesApi from './FeaturesApi';

describe('FeaturesApi', () => {
    beforeEach(() => {
        mockCall.mockReset();
        vi.mocked(HeaderProperties.getXnin).mockReturnValue('12345678901');
        mockCall.mockResolvedValue({ success: true, data: {} });
    });

    it('fetchFeatures calls expected endpoint with headers', async () => {
        await FeaturesApi.fetchFeatures();

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: '/api/api/feature',
            functionName: 'fetchFeatures',
            customErrorMessage: 'Kunne ikke hente en liste over features',
            customSuccessMessage: 'Features hentet vellykket',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });
});
