import { log } from '~/utils/logger';

const API_URL = process.env.CONSENT_API_URL;

class ConsentApi {
    static async getBehandlings(orgName: string) {
        const url = `${API_URL}/consent-admin/behandling/${orgName}`;
        log('url', url);

        return this.fetchData(url);
    }

    static async getTjenste(orgName: string) {
        const url = `${API_URL}/consent-admin/tjeneste/${orgName}`;
        log('url', url);

        return this.fetchData(url);
    }

    static async getPersonopplysning() {
        const url = `${API_URL}/consent-admin/personopplysning`;
        log('url', url);

        return this.fetchData(url);
    }

    static async getBehandlingsgrunnlag() {
        const url = `${API_URL}/consent-admin/behandlingsgrunnlag`;
        log('url', url);

        return this.fetchData(url);
    }

    private static async fetchData(url: string) {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                // 'x-nin': process.env.PERSONALNUMBER || '',
                Authorization: 'Bearer ' + process.env.BEARER_TOKEN,
            },
        });

        return response.json();
    }
}

export default ConsentApi;
