import { beforeEach, describe, expect, it, vi } from 'vitest';

import OrganisationApi from '~/api/OrganisationApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { handleComponentIndexAction } from './actions';

vi.mock('~/api/OrganisationApi');
vi.mock('~/utils/selectedOrganization');

describe('handleComponentIndexAction', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    function createRequest(formData: Record<string, string>): Request {
        const body = new URLSearchParams(formData);
        return new Request('http://localhost/komponenter', {
            method: 'POST',
            body,
        });
    }

    it('calls OrganisationApi.updateComponent with parsed checkbox state', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        const expected = { success: true };
        vi.mocked(OrganisationApi.updateComponent).mockResolvedValue(expected as any);

        const result = await handleComponentIndexAction({
            request: createRequest({
                componentName: 'utdanning-larling',
                isChecked: 'true',
            }),
        });

        expect(getSelectedOrganization).toHaveBeenCalledTimes(1);
        expect(OrganisationApi.updateComponent).toHaveBeenCalledWith(
            'utdanning-larling',
            'fint-org',
            true
        );
        expect(result).toEqual(expected);
    });

    it('passes false when isChecked is not true', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(OrganisationApi.updateComponent).mockResolvedValue({ success: true } as any);

        await handleComponentIndexAction({
            request: createRequest({
                componentName: 'utdanning-larling',
                isChecked: 'false',
            }),
        });

        expect(OrganisationApi.updateComponent).toHaveBeenCalledWith(
            'utdanning-larling',
            'fint-org',
            false
        );
    });
});
