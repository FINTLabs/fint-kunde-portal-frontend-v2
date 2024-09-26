import { request } from '~/api/shared/api';

const API_URL = process.env.CONSENT_API_URL;

interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
}

async function fetchWithAuth(url: string, options: FetchOptions = {}) {
    const headers = {
        Accept: 'application/json',
        ...(process.env.NODE_ENV === 'development' && {
            Authorization: 'Bearer ' + process.env.BEARER_TOKEN,
        }),
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        credentials: 'same-origin',
        headers,
    });

    if (response.ok) {
        return await response.json();
    } else {
        const errorMsg = `Error fetching, status: ${response.status}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
    }
}

class ConsentApi {
    static async getBehandlings(orgName: string) {
        const url = `${API_URL}/consent-admin/behandling/${orgName}`;
        console.debug('url', url);
        // return await fetchWithAuth(url, { method: 'GET' });
        const functionName = 'getBehandlings';
        return await request(url, functionName, 'GET');
    }

    static async getTjenste(orgName: string) {
        const url = `${API_URL}/consent-admin/tjeneste/${orgName}`;
        console.debug('url', url);
        return await fetchWithAuth(url, { method: 'GET' });
    }

    static async getPersonopplysning() {
        const url = `${API_URL}/consent-admin/personopplysning`;
        console.debug('url', url);
        const functionName = 'getPersonopplysning';
        return await request(url, functionName, 'GET');
        // return await fetchWithAuth(url, { method: 'GET' });
    }

    static async getBehandlingsgrunnlag() {
        const url = `${API_URL}/consent-admin/behandlingsgrunnlag`;
        console.debug('url', url);
        return await fetchWithAuth(url, { method: 'GET' });
    }

    private static buildHeaders(contentType: string = 'application/json') {
        return {
            'Content-Type': contentType,
            Accept: 'application/json',
            ...(process.env.NODE_ENV === 'development' && {
                Authorization: 'Bearer ' + process.env.BEARER_TOKEN,
            }),
        };
    }

    static async setActive(orgName: string, behandlingId: string, isActive: string) {
        const url = `${API_URL}/consent-admin/behandling/${orgName}/${behandlingId}/${isActive}`;
        console.debug('url', url);
        return await fetch(url, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: this.buildHeaders(),
        });
    }

    static async createPolicy(
        serviceId: string,
        foundationId: string,
        personalDataId: string,
        description: string,
        orgName: string
    ) {
        const url = `${API_URL}/consent-admin/behandling/${orgName}`;
        console.debug('url', url);
        return await fetch(url, {
            method: 'POST',
            headers: this.buildHeaders(),
            body: JSON.stringify({
                aktiv: true,
                formal: description,
                behandlingsgrunnlagIds: [foundationId],
                tjenesteIds: [serviceId],
                personopplysningIds: [personalDataId],
            }),
        });
    }

    static async createService(serviceName: string, orgName: string) {
        const url = `${API_URL}/consent-admin/tjeneste/${orgName}`;
        console.debug('url', url);
        return await fetch(url, {
            method: 'POST',
            headers: this.buildHeaders(),
            body: JSON.stringify({ navn: serviceName }),
        });
    }
}

export default ConsentApi;
