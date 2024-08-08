import { request } from '~/api/shared/api';
import { API_URL } from './constants';

class MeApi {
    static async fetchMe(cookieHeader: string) {
        const functionName = 'fetchMe';
        const URL = `${API_URL}/api/me`;
        return request(URL, functionName, cookieHeader).catch((err) => {
            console.error('Error fetching me information:', err);
        });
    }

    static async fetchOrganisations() {
        const functionName = 'fetchOrganisations';
        const URL = `${API_URL}/api/contacts/organisations`;
        return request(URL, functionName);
    }
}

export default MeApi;
