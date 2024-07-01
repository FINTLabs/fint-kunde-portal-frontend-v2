import { error, log } from '~/utils/logger';
import { API_URL } from './constants';

class ContactApi {
    static async fetch() {
        log('Fetching contact information', `${API_URL}/api/contacts`);

        try {
            const response = await fetch(`${API_URL}/api/contacts`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'x-nin': process.env.PERSONALNUMBER || '',
                },
            });
            if (response.redirected) {
                log('Contact Request was redirected:', response.url);
            }

            if (response.ok) {
                return await response.json();
            } else {
                error('Error fetching contacts, status:', response.status);
                return null;
            }
        } catch (err) {
            error('Error fetching contacts:', err);
            throw new Error('Error fetching contacts');
        }
    }

    static async fetchTechnicalContacts(orgName: string) {
        log(
            'Fetching technical contacts',
            `${API_URL}/api/organisations/${orgName}/contacts/technical`
        );

        try {
            const response = await fetch(
                `${API_URL}/api/organisations/${orgName}/contacts/technical`,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-nin': process.env.PERSONALNUMBER || '',
                    },
                }
            );

            if (response.ok) {
                return await response.json();
            } else {
                error('Error fetching contacts, status:', response.status);
                return null;
            }
        } catch (err) {
            error('Error fetching contacts:', err);
            throw new Error('Error fetching technical contacts');
        }
    }
}

export default ContactApi;
