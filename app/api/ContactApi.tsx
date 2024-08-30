import { request } from '~/api/shared/api';
import { API_URL } from './constants';
import { log } from '~/utils/logger';

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
        // const request = new Request(`/api/organisations/${orgName}/contacts/legal/${contactNin}`, {
        //     method: 'DELETE',
        //     headers: new Headers({
        //         'Content-Type': 'application/json'
        //     }),
        //     credentials: 'same-origin',
        //     body: JSON.stringify({
        //         name: contactNin
        //     })
        // });
        //
        // return fetch(request).then(response => {
        //     return response.json();
        // }).catch(error => {
        //     return error;
        // });
    }

    static async setLegalContact(contactNin: string, organisation: string) {
        log('RUNNING SET LEGAL', contactNin);
        //TODO fix this

        await this.unsetLegalContact(contactNin, organisation);
        const url = `${API_URL}/api/organisations/${organisation}/contacts/technical/${contactNin}`;

        // return await request(url, 'setLegalContact', 'PUT', 'json', { name: contactNin });

        const request = new Request(
            `${API_URL}/api/organisations/${organisation}/contacts/legal/${contactNin}`,
            {
                method: 'PUT',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'x-nin': process.env.PERSONALNUMBER || '',
                }),
                credentials: 'same-origin',
                body: JSON.stringify({
                    name: contactNin,
                }),
            }
        );

        try {
            return await fetch(request);
        } catch (error) {
            return error;
        }
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
