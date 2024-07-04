import { fetchData } from '~/api/shared/api';
class AdapterAPI {
    static async getAdapters(organisationName: string) {
        const API_URL = process.env.API_URL || 'https://kunde-beta.fintlabs.no';

        const functionName = 'getAdapters';
        const URL = `${API_URL}/api/adapters/${organisationName}`;
        return fetchData(URL, functionName);
    }

    static async getOpenIdSecret(adapterName: string, organisationName: string) {
        const functionName = 'getOpenIdSecret';
        // const API_URL = process.env.API_URL || 'https://kunde-beta.fintlabs.no';
        const API_URL = 'http://localhost:8080';

        const URL = `${API_URL}/api/adapters/${organisationName}/${adapterName}`;

        return functionName;
        // return fetchData(URL, functionName, 'text');
    }
}
export default AdapterAPI;
