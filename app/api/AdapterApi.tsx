import { request } from '~/api/shared/api';
import { API_URL } from './constants';
import { IPartialAdapter } from '~/types/types';
import { HeaderProperties } from '~/utils/headerProperties';

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

    static async updateAdapter(adapter: IPartialAdapter, organisationName: string) {
        const functionName = 'updateAdapter';
        const URL = `${API_URL}/api/adapters/${organisationName}/${adapter.name}`;
        return await request(URL, functionName, 'PUT', 'json', adapter);
    }

    static async updateComponentInAdapter(
        componentName: string,
        adapterName: string,
        organisationName: string,
        updateType: string
    ) {
        const URL = `${API_URL}/api/components/organisation/${organisationName}/${componentName}/adapters/${adapterName}`;
        if (updateType === 'add') {
            return await AdapterAPI.addComponentToAdapter(URL, componentName);
        } else {
            return await AdapterAPI.removeComponentFromAdapter(URL, componentName);
        }
    }

    static async addComponentToAdapter(URL: string, adapterName: string) {
        const functionName = 'addComponentToAdapter';
        return await request(URL, functionName, 'PUT', 'json', { name: adapterName });
    }

    static async removeComponentFromAdapter(URL: string, adapterName: string) {
        const functionName = 'removeComponentFromAdapter';
        return await request(URL, functionName, 'DELETE', 'json', { name: adapterName });
    }

    static async deleteAdapter(name: string, organisationName: string) {
        const functionName = 'deleteAdapter';
        const URL = `${API_URL}/api/adapters/${organisationName}/${name}`;
        return await request(URL, functionName, 'DELETE');
    }

    static async getOpenIdSecret(adapterName: string, organisationName: string) {
        const functionName = 'getOpenIdSecret';
        const URL = `${API_URL}/api/adapters/${organisationName}/${adapterName}/secret`;
        return await request(URL, functionName, 'GET', 'text');
    }

    static async setPassword(adapterName: string, password: string, organisationName: string) {
        console.log('Create new password adapter: ', adapterName, password);
        const request = new Request(
            `${API_URL}/api/adapters/${organisationName}/${adapterName}/password`,
            {
                method: 'PUT',
                headers: {
                    Accept: '*/*',
                    'Content-Type': 'text/plain',
                    'x-nin': HeaderProperties.getXnin()
                },
                credentials: 'same-origin',
                body: password,
            }
        );
        return fetch(request)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                return error;
            });
    }
}
export default AdapterAPI;
