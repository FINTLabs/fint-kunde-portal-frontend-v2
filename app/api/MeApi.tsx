import { request } from '~/api/shared/api';
import { API_URL } from './constants';

class MeApi {
    static async fetchMe() {
        const functionName = 'fetchMe';
        const URL = `${API_URL}/api/me`;
        return request(URL, functionName).catch((err) => {
            console.error('Error fetching me information:', err);
            // TODO: REMOVE !! THIS IS JUST FOR STARTUP
            return {
                dn: 'test.user',
                nin: '00000000000',
                firstName: 'Test',
                lastName: 'User',
                mail: 'TEST EMAIL',
                mobile: '000000000',
                technical: [],
                legal: [],
                supportId: '000000000',
                roles: [],
            };
        });
    }

    static async fetchOrganisations() {
        const functionName = 'fetchOrganisations';
        const URL = `${API_URL}/api/contacts/organisations`;
        return request(URL, functionName);
    }
}

export default MeApi;
