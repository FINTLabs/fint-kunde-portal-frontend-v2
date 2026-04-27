import { beforeEach, describe, expect, it, vi } from 'vitest';

import AccessApi from '~/api/AccessApi';
import AdapterAPI from '~/api/AdapterApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { handleAdapterIndexAction } from './actions';

vi.mock('~/api/AccessApi');
vi.mock('~/api/AdapterApi');
vi.mock('~/utils/selectedOrganization');

describe('handleAdapterIndexAction', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    function createRequest(formData: Record<string, string>): Request {
        const body = new URLSearchParams(formData);
        return new Request('http://localhost/adaptere', {
            method: 'POST',
            body,
        });
    }

    it('creates adapter, adds access and redirects on success', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(AdapterAPI.createAdapter).mockResolvedValue({
            success: true,
            data: { name: 'my-adapter@adapter.fint.no' },
        } as any);
        vi.mocked(AccessApi.addAccess).mockResolvedValue({ success: true } as any);

        const request = createRequest({
            name: 'my-adapter@adapter.fint.no',
            description: 'Kort beskrivelse',
            detailedInfo: 'Detaljert info',
        });

        const response = await handleAdapterIndexAction({ request });

        expect(getSelectedOrganization).toHaveBeenCalledWith(request);
        expect(AdapterAPI.createAdapter).toHaveBeenCalledWith(
            {
                name: 'my-adapter@adapter.fint.no',
                shortDescription: 'Kort beskrivelse',
                note: 'Detaljert info',
            },
            'fint-org'
        );
        expect(AccessApi.addAccess).toHaveBeenCalledWith('my-adapter@adapter.fint.no');
        expect(response).toBeInstanceOf(Response);
        expect(response.status).toBe(302);
        expect(response.headers.get('Location')).toBe('/adapter/my-adapter@adapter.fint.no');
    });

    it('throws 500 response when adapter creation fails', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(AdapterAPI.createAdapter).mockResolvedValue({
            success: false,
            data: null,
        } as any);

        const request = createRequest({
            name: 'my-adapter@adapter.fint.no',
            description: 'Kort beskrivelse',
            detailedInfo: 'Detaljert info',
        });

        await expect(handleAdapterIndexAction({ request })).rejects.toMatchObject({
            status: 500,
            statusText: '',
        });
        expect(AccessApi.addAccess).not.toHaveBeenCalled();
    });
});
