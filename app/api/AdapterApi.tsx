import { request } from '~/api/shared/api';
import { API_URL } from './constants';
import { IAdapter, IPartialAdapter } from '~/types/types';
class AdapterAPI {
    static async getAdapters(organisationName: string) {
        const functionName = 'getAdapters';
        const URL = `${API_URL}/api/adapters/${organisationName}`;
        return await request(URL, functionName);
    }
    static async createAdapter(adapter: IPartialAdapter, organisationName: string) {
        const functionName = 'createAdapter';
        const URL = `${API_URL}/api/adapters/${organisationName}`;
        return await request(URL, functionName, 'POST', 'json', adapter);
    }

    static async deleteAdapter(name: string, organisationName: string) {
        const functionName = 'deleteAdapter';
        const URL = `${API_URL}/api/adapters/${organisationName}/${name}`;
        return await request(URL, functionName, 'DELETE');
    }

    static async getOpenIdSecret(adapterName: string, organisationName: string) {
        const functionName = 'getOpenIdSecret';
        const API_URL = 'http://localhost:3000';
        const URL = `${API_URL}/api/adapters/${organisationName}/${adapterName}/secret`;

        return await request(URL, functionName, 'GET', 'text');
    }
}
export default AdapterAPI;
