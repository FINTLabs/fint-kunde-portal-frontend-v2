import { log } from '~/utils/logger';
import { request } from '~/api/shared/api';

const API_URL = process.env.CONSENT_API_URL;

class ConsentApi {
    static async getServices(orgName: string, cookies: string) {
        const url = `${API_URL}/consent-admin/tjeneste/${orgName}`;
        log('Cookies:', cookies);
        log('url', url);
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'x-nin': process.env.PERSONALNUMBER || '',
                Cookie: cookies, // Include cookies in the request headers
            },
        });
        log(response);
        return await response.json();
    }

    static async getTest(orgName: string) {
        const functionName = 'getOrganisationComponents';
        const URL = `${API_URL}/consent-admin/tjeneste/${orgName}`;
        log('test url', URL);
        return request(URL, functionName);
    }
}

export default ConsentApi;
