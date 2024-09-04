import { request } from '~/api/shared/api';
import { API_URL } from './constants';

class ContactApi {
    static async getAllContacts() {
        const functionName = 'fetchContacts';
        const URL = `${API_URL}/api/contacts`;
        return request(URL, functionName);
    }

    static async getTechnicalContacts(orgName: string) {
        const functionName = 'fetchTechnicalContacts';
        const URL = `${API_URL}/api/organisations/${orgName}/contacts/technical`;
        return request(URL, functionName);
    }

    static unsetLegalContact(contactNin: string, orgName: string) {
        const functionName = 'unsetLegalContact';
        const URL = `${API_URL}/api/organisations/${orgName}/contacts/legal/${contactNin}`;

        return request(URL, functionName, 'DELETE');
    }

    static async setLegalContact(contactNin: string, organisation: string) {
        await this.unsetLegalContact(contactNin, organisation);
        const url = `${API_URL}/api/organisations/${organisation}/contacts/legal/${contactNin}`;
        return await request(url, 'setLegalContact', 'PUT', 'json');
    }

    static async addTechnicalContact(contactNin: string, organisation: string) {
        const url = `${API_URL}/api/organisations/${organisation}/contacts/technical/${contactNin}`;
        return await request(url, 'addTechnicalContact', 'PUT', 'json');
    }

    static async removeTechnicalContact(contactNin: string, orgName: string) {
        const url = `${API_URL}/api/organisations/${orgName}/contacts/technical/${contactNin}`;
        return await request(url, 'removeTechnicalContact', 'DELETE', 'json');
    }
}

export default ContactApi;
