import { error, log } from '~/utils/logger';

const API_URL = process.env.CONSENT_API_URL;

interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
}

async function fetchWithAuth(url: string, options: FetchOptions = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + process.env.BEARER_TOKEN,
                ...options.headers,
            },
        });

        if (response.ok) {
            return await response.json();
        } else {
            error('Error fetching, status:', response.status);
            return null;
        }
    } catch (err) {
        error('Error fetching:', err);
        return null;
    }
}

class ConsentApi {
    static async getBehandlings(orgName: string) {
        const url = `${API_URL}/consent-admin/behandling/${orgName}`;
        log('url', url);
        return await fetchWithAuth(url, { method: 'GET' });
    }

    static async getTjenste(orgName: string) {
        const url = `${API_URL}/consent-admin/tjeneste/${orgName}`;
        log('url', url);
        return await fetchWithAuth(url, { method: 'GET' });
    }

    static async getPersonopplysning() {
        const url = `${API_URL}/consent-admin/personopplysning`;
        log('url', url);
        return await fetchWithAuth(url, { method: 'GET' });
    }

    static async getBehandlingsgrunnlag() {
        const url = `${API_URL}/consent-admin/behandlingsgrunnlag`;
        log('url', url);
        return await fetchWithAuth(url, { method: 'GET' });
    }

    static async setActive(orgName: string, behandlingId: string, isActive: string) {
        const url = `${API_URL}/consent-admin/behandling/${orgName}/${behandlingId}/${isActive}`;
        log('url', url);
        return await fetch(url, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + process.env.BEARER_TOKEN,
            },
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
        log('url', url);
        return await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + process.env.BEARER_TOKEN,
            },
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
        log('url', url);
        log('----------body', serviceName);
        return await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + process.env.BEARER_TOKEN,
            },
            body: JSON.stringify({ navn: serviceName }),
        });
    }
}

export default ConsentApi;
