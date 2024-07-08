import { request } from '~/api/shared/api';
import { API_URL } from './constants';

class FeaturesApi {
    static async fetchFeatures() {
        const functionName = 'fetchFeatures';
        const URL = `${API_URL}/api/api/feature`;
        return request(URL, functionName).catch((err) => {
            console.error('Error fetching features information:', err);
            // TODO: REMOVE !! THIS IS JUST FOR STARTUP
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
        });
    }
}

export default FeaturesApi;
