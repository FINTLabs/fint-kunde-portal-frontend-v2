import { request } from '~/api/shared/api';

const API_URL = process.env.ACCESS_URL;
class AccessApi {
    static async getClientorAdapterAccess(name: string) {
        const functionName = 'getClientorAdapterAccess';
        const URL = `${API_URL}/access/${name}`;
        return await request(URL, functionName);
    }

    static async getComponentAccess(name: string, clientOrAdapter: string) {
        const functionName = 'getComponentAccess';
        const URL = `${API_URL}/access/${clientOrAdapter}/${name}`;
        return await request(URL, functionName);
    }

    static async getFieldAccess(
        clientOrAdapter: string,
        componentName: string,
        resourceName: string
    ) {
        const functionName = 'getFieldAccess';
        const URL = `${API_URL}/access/${clientOrAdapter}/${componentName}/${resourceName}`;
        return await request(URL, functionName);
    }
}

export default AccessApi;
