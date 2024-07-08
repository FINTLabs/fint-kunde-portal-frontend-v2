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

    // static async getOrganisation(organisationName: string): Promise<any> {
    //     const functionName = 'getOrganisation';
    //     const URL = `${API_URL}/api/organisations/${organisationName}`;
    //     return request(URL, functionName);
    // }
    //
    // static async linkComponent(component: { name: string }, organisationName: string): Promise<any> {
    //     const functionName = 'linkComponent';
    //     const URL = `${API_URL}/api/organisations/${organisationName}/components/${component.name}`;
    //     return request(URL, functionName, 'PUT', 'json', { name: component.name });
    // }
    //
    // static async unlinkComponent(component: { name: string }, organisationName: string): Promise<any> {
    //     const functionName = 'unlinkComponent';
    //     const URL = `${API_URL}/api/organisations/${organisationName}/components/${component.name}`;
    //     return request(URL, functionName, 'DELETE', 'json', { name: component.name });
    // }
    //
    // static async addTechnicalContact(nin: string, organisationName: string): Promise<any> {
    //     const functionName = 'addTechnicalContact';
    //     const URL = `${API_URL}/api/organisations/${organisationName}/contacts/technical/${nin}`;
    //     return request(URL, functionName, 'PUT', 'json', { nin });
    // }
    //
    // static async removeTechnicalContact(contact: { nin: string }, organisationName: string): Promise<any> {
    //     const functionName = 'removeTechnicalContact';
    //     const URL = `${API_URL}/api/organisations/${organisationName}/contacts/technical/${contact.nin}`;
    //     return request(URL, functionName, 'DELETE', 'json', { nin: contact.nin });
    // }
    //
    // static async setLegalContact(contact: { nin: string }, organisationName: string): Promise<any> {
    //     const functionName = 'setLegalContact';
    //     const URL = `${API_URL}/api/organisations/${organisationName}/contacts/legal/${contact.nin}`;
    //     return request(URL, functionName, 'PUT', 'json', { name: contact.nin });
    // }
    //
    // static async unsetLegalContact(contact: { nin: string }, organisationName: string): Promise<any> {
    //     const functionName = 'unsetLegalContact';
    //     const URL = `${API_URL}/api/organisations/${organisationName}/contacts/legal/${contact.nin}`;
    //     return request(URL, functionName, 'DELETE', 'json', { name: contact.nin });
    // }
    //
    // static async getPrimaryAsset(organisation: Organisation): Promise<any> {
    //     const functionName = 'getPrimaryAsset';
    //     const URL = `${API_URL}/api/organisations/${organisation.name}/asset/primary`;
    //     return request(URL, functionName);
    // }
}

export default OrganisationApi;
