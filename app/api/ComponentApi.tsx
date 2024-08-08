import { request } from '~/api/shared/api';
import { API_URL } from './constants';
import { IClient } from '~/types/Clients';

class ComponentApi {
    static async getAllComponents() {
        const functionName = 'getAllComponents';
        const URL = `${API_URL}/api/components`;
        return request(URL, functionName, '');
    }

    static async getComponentById(componentName: string) {
        return this.getAllComponents()
            .then((clients: IClient[]) => {
                const client = clients.find((item) => item.name === componentName);
                if (client) {
                    return client;
                } else {
                    console.error('Component not found, componentName:', componentName);
                    return null;
                }
            })
            .catch((err) => {
                console.error('Error fetching components:', err);
                return null;
            });
    }

    static async getOrganisationComponents(organisationName: string) {
        const functionName = 'getOrganisationComponents';
        const URL = `${API_URL}/api/components/organisation/${organisationName}`;
        return request(URL, functionName, '');
    }
}

export default ComponentApi;
