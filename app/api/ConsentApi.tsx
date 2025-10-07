import { NovariApiManager, type ApiResponse } from 'novari-frontend-components';

import type { IBehandling, ITjeneste, IPersonopplysning, IBehandlingsgrunnlag } from '~/types/Consent';
import { HeaderProperties } from '~/utils/headerProperties';

const CONSENT_API_URL = process.env.CONSENT_API_URL || '';
const consentManager = new NovariApiManager({
    baseUrl: CONSENT_API_URL,
});

class ConsentApi {
    static async getBehandlings(orgName: string): Promise<ApiResponse<IBehandling[]>> {
        return await consentManager.call<IBehandling[]>({
            method: 'GET',
            endpoint: `/consent-admin/behandling/${orgName}`,
            functionName: 'getBehandlings',
            customErrorMessage: `Kunne ikke hente behandlinger for organisasjonen: ${orgName}.`,
            customSuccessMessage: `Behandlinger for organisasjonen ${orgName} ble hentet.`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async getTjenste(orgName: string): Promise<ApiResponse<ITjeneste>> {
        return await consentManager.call<ITjeneste>({
            method: 'GET',
            endpoint: `/consent-admin/tjeneste/${orgName}`,
            functionName: 'getTjenste',
            customErrorMessage: `Kunne ikke hente tjenester for organisasjonen: ${orgName}.`,
            customSuccessMessage: `Tjenester for organisasjonen ${orgName} ble hentet.`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async getPersonopplysning(): Promise<ApiResponse<IPersonopplysning>> {
        return await consentManager.call<IPersonopplysning>({
            method: 'GET',
            endpoint: `/consent-admin/personopplysning`,
            functionName: 'getPersonopplysning',
            customErrorMessage: 'Kunne ikke hente personopplysninger.',
            customSuccessMessage: 'Personopplysninger ble hentet.',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async getBehandlingsgrunnlag(): Promise<ApiResponse<IBehandlingsgrunnlag>> {
        return await consentManager.call<IBehandlingsgrunnlag>({
            method: 'GET',
            endpoint: `/consent-admin/behandlingsgrunnlag`,
            functionName: 'getBehandlingsgrunnlag',
            customErrorMessage: 'Kunne ikke hente behandlingsgrunnlag.',
            customSuccessMessage: 'Behandlingsgrunnlag ble hentet.',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async setActive(
        orgName: string,
        behandlingId: string,
        isActive: string
    ): Promise<ApiResponse<IBehandling>> {
        const successMessage =
            isActive === 'true'
                ? `Behandlingen ${behandlingId} i organisasjonen ${orgName} er nå aktiv.`
                : `Behandlingen ${behandlingId} i organisasjonen ${orgName} er nå inaktiv.`;

        return await consentManager.call<IBehandling>({
            method: 'PUT',
            endpoint: `/consent-admin/behandling/${orgName}/${behandlingId}/${isActive}`,
            functionName: 'setActive',
            customErrorMessage: `Kunne ikke oppdatere aktiv-status for behandling ${behandlingId} i organisasjonen: ${orgName}.`,
            customSuccessMessage: successMessage,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
            // customSuccessVariant: isActive === 'true' ? 'success' : 'warning', // uncomment if supported
        });
    }

    static async createPolicy(
        serviceId: string,
        foundationId: string,
        personalDataId: string,
        description: string,
        orgName: string
    ): Promise<ApiResponse<IBehandling>> {
        return await consentManager.call<IBehandling>({
            method: 'POST',
            endpoint: `/consent-admin/behandling/${orgName}`,
            functionName: 'createPolicy',
            body: JSON.stringify({
                aktiv: true,
                formal: description,
                behandlingsgrunnlagIds: [foundationId],
                tjenesteIds: [serviceId],
                personopplysningIds: [personalDataId],
            }),
            customErrorMessage: `Kunne ikke opprette policy for organisasjonen: ${orgName}.`,
            customSuccessMessage: `Policy for organisasjonen ${orgName} ble opprettet.`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async createService(serviceName: string, orgName: string): Promise<ApiResponse<ITjeneste>> {
        return await consentManager.call<ITjeneste>({
            method: 'POST',
            endpoint: `/consent-admin/tjeneste/${orgName}`,
            functionName: 'createService',
            body: JSON.stringify({ navn: serviceName }),
            customErrorMessage: `Kunne ikke opprette tjeneste med navn ${serviceName} for organisasjonen: ${orgName}.`,
            customSuccessMessage: `Tjenesten ${serviceName} for organisasjonen ${orgName} ble opprettet.`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }
}

export default ConsentApi;
