import { request } from '~/api/shared/api';
import { API_URL } from './constants';

class FeaturesApi {
    static async fetchFeatures() {
        const functionName = 'fetchFeatures';
        const URL = `${API_URL}/api/api/feature`;

        return {
            'audit-log-new': true,
            'samtykke-admin-new': true,
            'access-packages-new': true,
            'roles-new': true,
            'roles-init-new': true,
            'access-packages': false,
            'samtykke-admin': false,
            roles: false,
            'audit-log': false,
            'roles-init': false,
        };
        return await request(URL, functionName);
    }
}

export default FeaturesApi;
