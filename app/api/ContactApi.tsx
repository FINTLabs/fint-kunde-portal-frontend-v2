import { request } from '~/api/shared/api';
import { API_URL } from './constants';

class ContactApi {
    static async fetch() {
        const functionName = 'fetchContacts';
        const URL = `${API_URL}/api/contacts`;
        return request(URL, functionName);
    }

    static async fetchTechnicalContacts(orgName: string) {
        const functionName = 'fetchTechnicalContacts';
        const URL = `${API_URL}/api/organisations/${orgName}/contacts/technical`;
        return request(URL, functionName);
    }
}

export default ContactApi;
