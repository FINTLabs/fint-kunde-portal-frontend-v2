import { beforeEach, describe, expect, it, vi } from 'vitest';

import AccessApi from '~/api/AccessApi';

import { handleAccessElementAction } from './actions';

vi.mock('~/api/AccessApi');

describe('handleAccessElementAction', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    function createRequest(formData: Record<string, string>): Request {
        const body = new URLSearchParams(formData);
        return new Request('http://localhost/tilgang/client-a/utdanning-elev', {
            method: 'POST',
            body,
        });
    }

    it('calls updateResources for ENABLE_RESOURCE', async () => {
        const expected = { success: true };
        vi.mocked(AccessApi.updateResources).mockResolvedValue(expected as any);

        const result = await handleAccessElementAction({
            request: createRequest({
                actionType: 'ENABLE_RESOURCE',
                enabled: 'true',
                username: 'client-a@client.fint.no',
                component: 'utdanning-elev',
                resource: 'elev',
            }),
        });

        expect(AccessApi.updateResources).toHaveBeenCalledWith('client-a@client.fint.no', 'utdanning-elev', [
            {
                component: 'utdanning-elev',
                resource: 'elev',
                enabled: true,
                writeable: false,
                readingOption: 'MULTIPLE',
            },
        ]);
        expect(result).toEqual(expected);
    });

    it('calls updateResources for ENABLE_ALL_RESOURCES', async () => {
        const resources = [
            {
                component: 'elev',
                resource: 'elev',
                enabled: true,
                writeable: false,
                readingOption: 'MULTIPLE',
            },
        ];
        const expected = { success: true };
        vi.mocked(AccessApi.updateResources).mockResolvedValue(expected as any);

        const result = await handleAccessElementAction({
            request: createRequest({
                actionType: 'ENABLE_ALL_RESOURCES',
                username: 'client-a@client.fint.no',
                component: 'utdanning-elev',
                resources: JSON.stringify(resources),
            }),
        });

        expect(AccessApi.updateResources).toHaveBeenCalledWith(
            'client-a@client.fint.no',
            'utdanning-elev',
            resources
        );
        expect(result).toEqual(expected);
    });

    it('calls updateResources for DISABLE_ALL_RESOURCES', async () => {
        const resources = [
            {
                component: 'elev',
                resource: 'elev',
                enabled: false,
                writeable: false,
                readingOption: 'MULTIPLE',
            },
        ];
        vi.mocked(AccessApi.updateResources).mockResolvedValue({ success: true } as any);

        await handleAccessElementAction({
            request: createRequest({
                actionType: 'DISABLE_ALL_RESOURCES',
                username: 'client-a@client.fint.no',
                component: 'utdanning-elev',
                resources: JSON.stringify(resources),
            }),
        });

        expect(AccessApi.updateResources).toHaveBeenCalledWith(
            'client-a@client.fint.no',
            'utdanning-elev',
            resources
        );
    });

    it('returns warning when bulk update has no resources', async () => {
        const result = await handleAccessElementAction({
            request: createRequest({
                actionType: 'ENABLE_ALL_RESOURCES',
                username: 'client-a@client.fint.no',
                component: 'utdanning-elev',
            }),
        });

        expect(result).toEqual({
            success: false,
            message: 'Ingen ressurser å oppdatere',
            variant: 'warning',
        });
        expect(AccessApi.updateResources).not.toHaveBeenCalled();
    });

    it('returns error payload for unknown actionType', async () => {
        const result = await handleAccessElementAction({
            request: createRequest({
                actionType: 'UNKNOWN',
            }),
        });

        expect(result).toEqual({
            success: false,
            message: 'Ukjent handlingstype: UNKNOWN',
            variant: 'error',
        });
    });
});
