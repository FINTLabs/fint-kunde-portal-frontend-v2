import { request } from '~/api/shared/api';
import { API_URL } from '~/api/constants';

class OrganisationApi {
    static async getTechnicalContacts(organisationName: string): Promise<any> {
        const functionName = 'getTechnicalContacts';
        const URL = `${API_URL}/api/organisations/${organisationName}/contacts/technical`;
        return request(URL, functionName);
    }

    static async getLegalContact(organisationName: string): Promise<any> {
        const functionName = 'getLegalContact';
        const URL = `${API_URL}/api/organisations/${organisationName}/contacts/legal`;
        return request(URL, functionName);
    }

    static async updateComponent(
        componentName: string,
        organisationName: string,
        updateType: string
    ) {
        const URL = `${API_URL}/api/organisations/${organisationName}/components/${componentName}`;
        if (updateType === 'add') {
            return await OrganisationApi.addComponentToOrganisation(URL, componentName);
        } else {
            return await OrganisationApi.removeComponentFromOrganisation(URL, componentName);
        }
    }

    static async addComponentToOrganisation(URL: string, componentName: string) {
        const functionName = 'addComponentToOrganisation';
        return await request(URL, functionName, 'PUT', 'json', { name: componentName });
    }

    static async removeComponentFromOrganisation(URL: string, componentName: string) {
        const functionName = 'removeComponentFromOrganisation';
        return await request(URL, functionName, 'DELETE', 'json', { name: componentName });
    }

}

export default OrganisationApi;
