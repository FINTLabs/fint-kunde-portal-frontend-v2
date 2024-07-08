import { request } from '~/api/shared/api';
import { API_URL } from './constants';

class FeaturesApi {
    static async fetchFeatures() {
        const functionName = 'fetchFeatures';
        const URL = `${API_URL}/api/api/feature`;

        return await request(URL, functionName);
    }
}

export default FeaturesApi;
