import { log, error } from '~/utils/logger';
import { API_URL } from './constants';

class ComponentApi {
    static async getApis() {
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

            if (response.redirected) {
                log('Components Request was redirected:', response.url);
            }

            if (response.ok) {
                return await response.json();
            } else {
                error('Error fetching components information', response.status);
                return 'try-error';
            }
        } catch (err) {
            log(err);
            error('Error fetching components information:', err);
            return 'catch-error';
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

            if (response.redirected) {
                log('Organisation Components Request was redirected:', response.url);
            }

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
