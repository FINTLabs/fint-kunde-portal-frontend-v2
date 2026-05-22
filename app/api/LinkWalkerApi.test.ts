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

import LinkWalkerApi from './LinkWalkerApi';

describe('LinkWalkerApi', () => {
    const orgName = 'fint-org';

    beforeEach(() => {
        mockCall.mockReset();
        vi.mocked(HeaderProperties.getXnin).mockReturnValue('12345678901');
        mockCall.mockResolvedValue({ success: true, data: [] });
    });

    it('getTests calls expected endpoint with headers', async () => {
        await LinkWalkerApi.getTests(orgName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/link-walker/tasks/${orgName}`,
            functionName: 'getTests',
            customErrorMessage: `Kunne ikke hente tester for organisasjonen: ${orgName}`,
            customSuccessMessage: `Tester for organisasjonen ${orgName} ble hentet.`,
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('getLink returns download link for task result', () => {
        expect(LinkWalkerApi.getLink(orgName, 'result-id')).toContain(
            `/link-walker/tasks/${orgName}/result-id/download`
        );
    });

    it('addTest posts URL payload to expected endpoint', async () => {
        await LinkWalkerApi.addTest('https://example.no', orgName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'POST',
            endpoint: `/link-walker/tasks/${orgName}`,
            functionName: 'addTest',
            body: JSON.stringify({ url: 'https://example.no' }),
            customErrorMessage: `Kunne ikke legge til testen for organisasjonen: ${orgName}`,
            customSuccessMessage: `Testen for organisasjonen ${orgName} ble lagt til.`,
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('clearTests calls expected endpoint with headers', async () => {
        await LinkWalkerApi.clearTests(orgName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PUT',
            endpoint: `/link-walker/tasks/${orgName}`,
            functionName: 'clearTests',
            customErrorMessage: `Kunne ikke tømme testene for organisasjonen: ${orgName}`,
            customSuccessMessage: `Testene for organisasjonen ${orgName} ble tømt.`,
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });
});
