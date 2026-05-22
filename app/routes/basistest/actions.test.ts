import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleBasicTestAction } from './actions';

vi.mock('~/utils/selectedOrganization', () => ({
    getSelectedOrganization: vi.fn(async () => 'org-1'),
}));

const basicTestApiMocks = vi.hoisted(() => ({
    runTest: vi.fn(),
    runHealthTest: vi.fn(),
}));

vi.mock('~/api/BasicTestApi', () => ({
    default: {
        runTest: basicTestApiMocks.runTest,
        runHealthTest: basicTestApiMocks.runHealthTest,
    },
}));

describe('basistest action', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        basicTestApiMocks.runTest.mockResolvedValue({
            variant: 'info',
            data: { resourceResults: [{ status: 'OK' }] },
        });

        basicTestApiMocks.runHealthTest.mockResolvedValue({
            data: { healthData: [{ status: 'APPLICATION_HEALTHY' }] },
        });
    });

    it('parses form data, calls APIs, and returns combined payload', async () => {
        const form = new FormData();
        form.append('baseUrl', 'https://api.example.com');
        form.append('endpoint', '/health');
        form.append('clientName', 'client-x');

        const request = new Request('http://localhost/basistest', {
            method: 'POST',
            body: form,
        });

        const result = await handleBasicTestAction({ request });

        expect(basicTestApiMocks.runTest).toHaveBeenCalledWith(
            'org-1',
            'https://api.example.com',
            '/health',
            'client-x'
        );
        expect(basicTestApiMocks.runHealthTest).toHaveBeenCalledWith(
            'org-1',
            'https://api.example.com',
            '/health',
            'client-x'
        );

        expect(result).toEqual({
            message: 'Testet av: ',
            clientName: 'client-x',
            testUrl: 'https://api.example.com/health',
            variant: 'info',
            data: {
                healthData: { healthData: [{ status: 'APPLICATION_HEALTHY' }] },
                cacheData: { resourceResults: [{ status: 'OK' }] },
            },
        });
    });
});
