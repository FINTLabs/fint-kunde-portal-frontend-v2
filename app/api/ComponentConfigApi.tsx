import { API_URL } from '~/api/constants';
import { request } from '~/api/shared/api';

class ComponentConfigApi {

    static async getComponentConfigs() {
        const functionName = 'getComponentConfigs';
        const URL = `${API_URL}/api/components/configurations`;
        return await request(URL, functionName);
    }

}

export default ComponentConfigApi;
