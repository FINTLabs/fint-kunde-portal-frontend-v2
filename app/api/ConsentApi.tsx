import { apiManager, handleApiResponse } from '~/api/ApiManager';
import { IBehandling } from '~/types/Consent';

const API_URL = process.env.CONSENT_API_URL;

class ConsentApi {
    static async getBehandlings(orgName: string) {
        const apiResults = await apiManager<IBehandling>({
            method: 'GET',
            url: `${API_URL}/consent-admin/behandling/${orgName}`,
            functionName: 'getBehandlings',
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke hente behandlinger for organisasjonen: ${orgName}.`,
            `Behandlinger for organisasjonen ${orgName} ble hentet.`,
            'success'
        );
    }

    static async getTjenste(orgName: string) {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/consent-admin/tjeneste/${orgName}`,
            functionName: 'getTjenste',
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke hente tjenester for organisasjonen: ${orgName}.`,
            `Tjenester for organisasjonen ${orgName} ble hentet.`,
            'success'
        );
    }

    static async getPersonopplysning() {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/consent-admin/personopplysning`,
            functionName: 'getPersonopplysning',
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke hente personopplysninger.',
            'Personopplysninger ble hentet.',
            'success'
        );
    }

    static async getBehandlingsgrunnlag() {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/consent-admin/behandlingsgrunnlag`,
            functionName: 'getBehandlingsgrunnlag',
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke hente behandlingsgrunnlag.',
            'Behandlingsgrunnlag ble hentet.',
            'success'
        );
    }

    static async setActive(orgName: string, behandlingId: string, isActive: string) {
        const apiResults = await apiManager<any>({
            method: 'PUT',
            url: `${API_URL}/consent-admin/behandling/${orgName}/${behandlingId}/${isActive}`,
            functionName: 'setActive',
        });

        const successMessage =
            isActive === 'true'
                ? `Behandlingen ${behandlingId} i organisasjonen ${orgName} er nå aktiv.`
                : `Behandlingen ${behandlingId} i organisasjonen ${orgName} er nå inaktiv.`;

        return handleApiResponse(
            apiResults,
            `Kunne ikke oppdatere aktiv-status for behandling ${behandlingId} i organisasjonen: ${orgName}.`,
            successMessage,
            isActive === 'true' ? 'success' : 'warning'
        );
    }

    static async createPolicy(
        serviceId: string,
        foundationId: string,
        personalDataId: string,
        description: string,
        orgName: string
    ) {
        const apiResults = await apiManager<any>({
            method: 'POST',
            url: `${API_URL}/consent-admin/behandling/${orgName}`,
            functionName: 'createPolicy',
            body: JSON.stringify({
                aktiv: true,
                formal: description,
                behandlingsgrunnlagIds: [foundationId],
                tjenesteIds: [serviceId],
                personopplysningIds: [personalDataId],
            }),
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke opprette policy for organisasjonen: ${orgName}.`,
            `Policy for organisasjonen ${orgName} ble opprettet.`,
            'success'
        );
    }

    static async createService(serviceName: string, orgName: string) {
        const apiResults = await apiManager<any>({
            method: 'POST',
            url: `${API_URL}/consent-admin/tjeneste/${orgName}`,
            functionName: 'createService',
            body: JSON.stringify({ navn: serviceName }),
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke opprette tjeneste med navn ${serviceName} for organisasjonen: ${orgName}.`,
            `Tjenesten ${serviceName} for organisasjonen ${orgName} ble opprettet.`,
            'success'
        );
    }
}

export default ConsentApi;
