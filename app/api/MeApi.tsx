import { request } from '~/api/shared/api';
import { API_URL } from './constants';

class MeApi {
    static async fetchMe(cookies: string, personNumber: string) {
        const functionName = 'fetchMe';
        const URL = `${API_URL}/api/me`;
        return request(URL, functionName, cookies, personNumber).catch((err) => {
            console.error('Error fetching me information:', err);
        });
    }

    static async fetchOrganisations(cookies: string, personNumber: string) {
        const functionName = 'fetchOrganisations';
        const URL = `${API_URL}/api/contacts/organisations`;
        return request(URL, functionName, cookies, personNumber);
    }
}

export default MeApi;
