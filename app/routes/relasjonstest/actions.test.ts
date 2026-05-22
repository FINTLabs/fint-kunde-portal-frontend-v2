import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('log4js', () => ({
    default: {
        getLogger: () => ({
            debug: vi.fn(),
        }),
    },
}));

vi.mock('~/api/LinkWalkerApi', () => ({
    default: {
        addTest: vi.fn(),
        clearTests: vi.fn(),
    },
}));

vi.mock('~/utils/selectedOrganization', () => ({
    getSelectedOrganization: vi.fn(),
}));

import LinkWalkerApi from '~/api/LinkWalkerApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { handleRelationTestAction } from './actions';

describe('handleRelationTestAction', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
    });

    function createRequest(formData: Record<string, string>): Request {
        const body = new URLSearchParams(formData);
        return new Request('http://localhost/relasjonstest', {
            method: 'POST',
            body,
        });
    }

    it('calls LinkWalkerApi.addTest for ADD_TEST', async () => {
        const expected = { success: true };
        vi.mocked(LinkWalkerApi.addTest).mockResolvedValue(expected as any);

        const result = await handleRelationTestAction({
            request: createRequest({
                actionType: 'ADD_TEST',
                testUrl: 'https://play-with-fint.felleskomponent.no/utdanning',
            }),
        });

        expect(LinkWalkerApi.addTest).toHaveBeenCalledWith(
            'https://play-with-fint.felleskomponent.no/utdanning',
            'fint-org'
        );
        expect(result).toEqual(expected);
    });

    it('calls LinkWalkerApi.clearTests for CLEAR_TESTS', async () => {
        const expected = { success: true };
        vi.mocked(LinkWalkerApi.clearTests).mockResolvedValue(expected as any);

        const result = await handleRelationTestAction({
            request: createRequest({
                actionType: 'CLEAR_TESTS',
            }),
        });

        expect(LinkWalkerApi.clearTests).toHaveBeenCalledWith('fint-org');
        expect(result).toEqual(expected);
    });

    it('returns error payload for unknown actionType', async () => {
        const result = await handleRelationTestAction({
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
