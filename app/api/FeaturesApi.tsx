import { log, error } from '~/utils/logger';
import { API_URL } from './constants';

class FeaturesApi {
    static async fetchFeatures() {
        const URL = `${API_URL}/api/api/feature`;
        log('Fetching me information', URL);

        try {
            const response = await fetch(URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-nin': process.env.PERSONALNUMBER || '',
                },
            });

            if (response.redirected) {
                log('Me Request was redirected:', response.url);
            }

            if (response.ok) {
                return await response.json();
            } else {
                error('Error fetching me information', response.status);
                return 'try-error';
            }
        } catch (err) {
            log(err);
            error('Error fetching me information:', err);
            // return "catch-error";
            // TODO: REMOVE !! THIS IS JUST FOR STARTUP
            return {
                'audit-log-new': true,
                'samtykke-admin-new': true,
                'access-packages-new': true,
                'roles-new': true,
                'roles-init-new': true,
                'access-packages': false,
                'samtykke-admin': false,
                roles: false,
                'audit-log': false,
                'roles-init': false,
            };
        }
    }
}
export default FeaturesApi;
