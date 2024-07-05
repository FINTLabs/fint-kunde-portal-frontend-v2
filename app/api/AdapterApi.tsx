import { API_URL } from './constants';
import { fetchData } from '~/api/shared/api';
class AdapterAPI {
    static async getAdapters(organisationName: string) {
        const functionName = 'getAdapters';
        const URL = `${API_URL}/api/adapters/${organisationName}`;
        return fetchData(URL, functionName);
    }

    static async getOpenIdSecret(adapterName: string, organisationName: string) {
        const functionName = 'getOpenIdSecret';
        const URL = `${API_URL}/api/adapters/${organisationName}/${adapterName}`;
        return fetchData(URL, functionName);
    }
}
export default AdapterAPI;
