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

    static async addTechnicalContact(nin: string, organisation: string) {
        const url = `${API_URL}/api/organisations/${organisation}/contacts/technical/${nin}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-nin': process.env.PERSONALNUMBER || '',
            },
        });
        if (response.ok) {
            log('Technical contact added');
            return { message: 'Technical Kontakt ble oppdatert', variant: 'success' };
        } else {
            log('Error adding technical contact:', response.statusText);
            return {
                message:
                    'Det oppsto en feil ved oppdatering av kontakt.' +
                    response.status +
                    ' ' +
                    response.statusText,
                variant: 'error',
            };
        }
    }
}

export default ContactApi;
