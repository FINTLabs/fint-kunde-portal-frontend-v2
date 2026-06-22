import { beforeEach, describe, expect, it, vi } from 'vitest';

import AccessApi from '~/api/AccessApi';

import { handleFieldAccessAction } from './actions';

vi.mock('~/api/AccessApi');

describe('handleFieldAccessAction', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    function createRequest(formData: Record<string, string>): Request {
        const body = new URLSearchParams(formData);
        return new Request('http://localhost/tilgang/client-a/utdanning-elev/elev', {
            method: 'POST',
            body,
        });
    }

    it('calls updateFieldAccess for ENABLE_FIELD', async () => {
        const expected = { success: true };
        vi.mocked(AccessApi.updateFieldAccess).mockResolvedValue(expected as any);

        const result = await handleFieldAccessAction({
            request: createRequest({
                actionType: 'ENABLE_FIELD',
                username: 'client-a@client.fint.no',
                componentName: 'utdanning-elev',
                resourceName: 'elev',
                fieldName: 'systemId',
                enabled: 'true',
            }),
        });

        expect(AccessApi.updateFieldAccess).toHaveBeenCalledWith(
            'client-a@client.fint.no',
            'utdanning-elev',
            'elev',
            'systemId',
            'true'
        );
        expect(result).toEqual(expected);
    });

    it('calls addFieldAccess for SAVE_FIELDS', async () => {
        const fields = [{ name: 'systemId', enabled: true }];
        const expected = { success: true };
        vi.mocked(AccessApi.addFieldAccess).mockResolvedValue(expected as any);

        const result = await handleFieldAccessAction({
            request: createRequest({
                actionType: 'SAVE_FIELDS',
                username: 'client-a@client.fint.no',
                componentName: 'utdanning-elev',
                resourceName: 'elev',
                fields: JSON.stringify(fields),
            }),
        });

        expect(AccessApi.addFieldAccess).toHaveBeenCalledWith(
            'client-a@client.fint.no',
            'utdanning-elev',
            'elev',
            fields
        );
        expect(result).toEqual(expected);
    });

    it('calls updateResources for UPDATE_RESOURCE', async () => {
        const expected = { success: true };
        vi.mocked(AccessApi.updateResources).mockResolvedValue(expected as any);

        const result = await handleFieldAccessAction({
            request: createRequest({
                actionType: 'UPDATE_RESOURCE',
                username: 'client-a@client.fint.no',
                componentName: 'utdanning-elev',
                resourceName: 'elev',
                enabled: 'true',
                writeable: 'true',
                readingOption: 'SINGULAR',
            }),
        });

        expect(AccessApi.updateResources).toHaveBeenCalledWith(
            'client-a@client.fint.no',
            'utdanning-elev',
            [
                {
                    component: 'utdanning-elev',
                    resource: 'elev',
                    enabled: true,
                    writeable: true,
                    readingOption: 'SINGULAR',
                },
            ]
        );
        expect(result).toEqual(expected);
    });

    it('returns error payload for unknown actionType', async () => {
        const result = await handleFieldAccessAction({
            request: createRequest({
                actionType: 'UNKNOWN',
            }),
        });

        expect(result).toEqual({
            success: false,
            message: "Ukjent handlingstype: 'UNKNOWN'",
            variant: 'error',
        });
    });
});
