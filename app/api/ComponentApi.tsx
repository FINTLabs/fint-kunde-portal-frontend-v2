import { log, error } from '~/utils/logger';
import { API_URL } from './constants';
import { IClient } from '~/types/Clients';

class ComponentApi {
    static async getAllComponents() {
        const url = `${API_URL}/api/components`;
        log('Fetching components information', url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'x-nin': process.env.PERSONALNUMBER || '',
                },
            });

            if (response.ok) {
                return await response.json();
            } else {
                error('Error fetching components information', response.status);
                return 'try-error';
            }
        } catch (err) {
            log(err);
            error('Error fetching components information:', err);
            throw new Error('Error fetching components information');
            // return 'catch-error';
        }
    }

    static async getComponentById(componentName: string) {
        try {
            const clients: IClient[] = await this.getAllComponents();
            log('client search', componentName);
            if (clients) {
                const client = clients.find((item) => item.name === componentName);

                if (client) {
                    return client;
                } else {
                    error('Component not found, componentName:', componentName);
                    return null;
                }
            } else {
                error('No clients found for organisation:', componentName);
                return null;
            }
        } catch (err) {
            error('Error fetching components:', err);
            return null;
        }
    }

    static async getOrganisationComponents(organisationName: string) {
        const url = `${API_URL}/api/components/organisation/${organisationName}`;
        log(`Fetching components for organisation ${organisationName}`, url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'x-nin': process.env.PERSONALNUMBER || '',
                },
            });

            if (response.ok) {
                return await response.json();
            } else {
                error(
                    `Error fetching components for organisation ${organisationName}`,
                    response.status
                );
                return 'try-error';
            }
        } catch (err) {
            log(err);
            error(`Error fetching components for organisation ${organisationName}:`, err);
            return 'catch-error';
        }
    }
}

export default ComponentApi;
