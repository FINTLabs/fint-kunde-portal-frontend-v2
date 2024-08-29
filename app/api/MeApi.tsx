import { request } from '~/api/shared/api';
import { API_URL } from './constants';

class MeApi {
    static async fetchMe(personNumber: string) {
        const functionName = 'fetchMe';
        const URL = `${API_URL}/api/me`;
        return request(URL, functionName, personNumber).catch((err) => {
            console.error('Error fetching me information:', err);
        });
    }

    static async fetchOrganisations(personNumber: string) {
        const functionName = 'fetchOrganisations';
        const URL = `${API_URL}/api/contacts/organisations`;
        return request(URL, functionName, personNumber);
    }
}

export default MeApi;
