import { request as request } from '~/api/shared/api';
import { API_URL } from './constants';
import { IAdapter } from '~/types/types';
class AdapterAPI {
    static async getAdapters(organisationName: string) {
        const functionName = 'getAdapters';
        const URL = `${API_URL}/api/adapters/${organisationName}`;
        return request(URL, functionName);
    }
    static async createAdapter(adapter: IAdapter, organisationName: string) {
        const functionName = 'createAdapter';
        const URL = `${API_URL}/api/adapters/${organisationName}`;
        return request(URL, functionName, 'POST');
    }

    static async deleteAdapter(name: string, organisationName: string) {
        const functionName = 'deleteAdapter';
        const URL = `${API_URL}/api/adapters/${organisationName}/${name}`;
        return request(URL, functionName, 'DELETE');
    }

    static async getOpenIdSecret(adapterName: string, organisationName: string) {
        const functionName = 'getOpenIdSecret';
        const URL = `${API_URL}/api/adapters/${organisationName}/${adapterName}/secret`;
        return request(URL, functionName, 'GET', 'text');
    }
}
export default AdapterAPI;
