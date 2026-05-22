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

import LogApi from './LogApi';

describe('LogApi', () => {
    beforeEach(() => {
        mockCall.mockReset();
        vi.mocked(HeaderProperties.getXnin).mockReturnValue('12345678901');
        mockCall.mockResolvedValue({ success: true, data: [] });
    });

    it('getLogs formats component and type in endpoint', async () => {
        await LogApi.getLogs('prod', 'fint-org', 'utdanning_elev', 'student', 'READ');

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: '/api/events/fint-org/prod/utdanning-elev/READ_STUDENT',
            functionName: 'getLogs',
            customErrorMessage: 'Kunne ikke hente logger for spesifisert ressurs.',
            customSuccessMessage: 'Logger for spesifisert ressurs ble hentet.',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });
});
