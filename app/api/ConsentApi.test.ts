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

import ConsentApi from './ConsentApi';

describe('ConsentApi', () => {
    const orgName = 'fint-org';

    beforeEach(() => {
        mockCall.mockReset();
        vi.mocked(HeaderProperties.getXnin).mockReturnValue('12345678901');
        mockCall.mockResolvedValue({ success: true, data: {} });
    });

    it('getBehandlings calls expected endpoint with headers', async () => {
        await ConsentApi.getBehandlings(orgName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/consent-admin/behandling/${orgName}`,
            functionName: 'getBehandlings',
            customErrorMessage: `Kunne ikke hente behandlinger for organisasjonen: ${orgName}.`,
            customSuccessMessage: `Behandlinger for organisasjonen ${orgName} ble hentet.`,
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('getTjenste calls expected endpoint with headers', async () => {
        await ConsentApi.getTjenste(orgName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/consent-admin/tjeneste/${orgName}`,
            functionName: 'getTjenste',
            customErrorMessage: `Kunne ikke hente tjenester for organisasjonen: ${orgName}.`,
            customSuccessMessage: `Tjenester for organisasjonen ${orgName} ble hentet.`,
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('getPersonopplysning calls expected endpoint with headers', async () => {
        await ConsentApi.getPersonopplysning();

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: '/consent-admin/personopplysning',
            functionName: 'getPersonopplysning',
            customErrorMessage: 'Kunne ikke hente personopplysninger.',
            customSuccessMessage: 'Personopplysninger ble hentet.',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('getBehandlingsgrunnlag calls expected endpoint with headers', async () => {
        await ConsentApi.getBehandlingsgrunnlag();

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: '/consent-admin/behandlingsgrunnlag',
            functionName: 'getBehandlingsgrunnlag',
            customErrorMessage: 'Kunne ikke hente behandlingsgrunnlag.',
            customSuccessMessage: 'Behandlingsgrunnlag ble hentet.',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('setActive uses active success message when status is true', async () => {
        await ConsentApi.setActive(orgName, 'behandling-id', 'true');

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PUT',
            endpoint: `/consent-admin/behandling/${orgName}/behandling-id/true`,
            functionName: 'setActive',
            customErrorMessage: `Kunne ikke oppdatere aktiv-status for behandling behandling-id i organisasjonen: ${orgName}.`,
            customSuccessMessage: `Behandlingen behandling-id i organisasjonen ${orgName} er nå aktiv.`,
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('setActive uses inactive success message when status is false', async () => {
        await ConsentApi.setActive(orgName, 'behandling-id', 'false');

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PUT',
            endpoint: `/consent-admin/behandling/${orgName}/behandling-id/false`,
            functionName: 'setActive',
            customErrorMessage: `Kunne ikke oppdatere aktiv-status for behandling behandling-id i organisasjonen: ${orgName}.`,
            customSuccessMessage: `Behandlingen behandling-id i organisasjonen ${orgName} er nå inaktiv.`,
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('createPolicy posts expected policy payload', async () => {
        await ConsentApi.createPolicy(
            'service-id',
            'foundation-id',
            'personal-data-id',
            'Formal',
            orgName
        );

        expect(mockCall).toHaveBeenCalledWith({
            method: 'POST',
            endpoint: `/consent-admin/behandling/${orgName}`,
            functionName: 'createPolicy',
            body: JSON.stringify({
                aktiv: true,
                formal: 'Formal',
                behandlingsgrunnlagIds: ['foundation-id'],
                tjenesteIds: ['service-id'],
                personopplysningIds: ['personal-data-id'],
            }),
            customErrorMessage: `Kunne ikke opprette policy for organisasjonen: ${orgName}.`,
            customSuccessMessage: `Policy for organisasjonen ${orgName} ble opprettet.`,
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('createService posts expected service payload', async () => {
        await ConsentApi.createService('service-a', orgName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'POST',
            endpoint: `/consent-admin/tjeneste/${orgName}`,
            functionName: 'createService',
            body: JSON.stringify({ navn: 'service-a' }),
            customErrorMessage: `Kunne ikke opprette tjeneste med navn service-a for organisasjonen: ${orgName}.`,
            customSuccessMessage: `Tjenesten service-a for organisasjonen ${orgName} ble opprettet.`,
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });
});
