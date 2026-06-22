import { beforeEach, describe, expect, it, vi } from 'vitest';

import LogApi from '~/api/LogApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { handleLogAction } from './actions';

vi.mock('~/api/LogApi');
vi.mock('~/utils/selectedOrganization');

describe('handleLogAction', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    function makeRequest(formData: Record<string, string>) {
        const body = new URLSearchParams(formData);
        return new Request('http://localhost/hendelseslogg', { method: 'POST', body });
    }

    it('returns error object when API returns no data', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(LogApi.getLogs).mockResolvedValue({
            success: true,
            data: [],
        } as any);

        const request = makeRequest({
            environment: 'api',
            component: 'comp-1',
            action: 'GET',
            resource: 'Student',
        });

        const result = await handleLogAction({ request });

        expect(LogApi.getLogs).toHaveBeenCalledWith('api', 'fint-org', 'comp-1', 'Student', 'GET');
        expect(result).toEqual({
            success: false,
            message: 'Kunne ikke hente logger for spesifisert ressurs.',
            variant: 'error',
        });
    });

    it('returns error object when API call is unsuccessful', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(LogApi.getLogs).mockResolvedValue({
            success: false,
            data: [{ anything: true }],
        } as any);

        const request = makeRequest({
            environment: 'api',
            component: 'comp-1',
            action: 'GET_ALL',
            resource: 'Student',
        });

        const result = await handleLogAction({ request });

        expect(result).toEqual({
            success: false,
            message: 'Kunne ikke hente logger for spesifisert ressurs.',
            variant: 'error',
        });
    });

    it('returns API response when it is successful and has data', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        const apiResponse = { success: true, data: [{ corrId: '1' }] };
        vi.mocked(LogApi.getLogs).mockResolvedValue(apiResponse as any);

        const request = makeRequest({
            environment: 'beta',
            component: 'comp-2',
            action: 'UPDATE',
            resource: 'Employee',
        });

        const result = await handleLogAction({ request });

        expect(LogApi.getLogs).toHaveBeenCalledWith(
            'beta',
            'fint-org',
            'comp-2',
            'Employee',
            'UPDATE'
        );
        expect(result).toEqual(apiResponse);
    });
});
