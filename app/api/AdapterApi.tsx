import { request as request } from '~/api/shared/api';
import { API_URL } from './constants';
class AdapterAPI {
    static async getAdapters(organisationName: string) {
        const functionName = 'getAdapters';
        const URL = `${API_URL}/api/adapters/${organisationName}`;
        return request(URL, functionName);
    }

    static async deleteAdapter(name: string, organisationName: string) {
        const functionName = 'getAdapters';
        const URL = `${API_URL}/api/adapters/${organisationName}/${name}`;
        return request(URL, functionName, 'DELETE');
    }

    static async getOpenIdSecret(adapterName: string, organisationName: string) {
        const functionName = 'getOpenIdSecret';
        // const API_URL = process.env.API_URL || 'https://kunde-beta.fintlabs.no';
        // const API_URL = 'http://localhost:8080';

        const URL = `${API_URL}/api/adapters/${organisationName}/${adapterName}/secret`;

        return request(URL, functionName, 'GET', 'text');
    }
}
export default AdapterAPI;
