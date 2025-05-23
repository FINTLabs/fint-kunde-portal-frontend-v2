import logger from '~/utils/logger';
import { apiManager } from '~/api/ApiManager';

const API_URL = process.env.API_URL;

class MeApi {
    static async fetchMe() {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/api/me`,
            functionName: 'fetchMe',
        });

        if (apiResults.success) {
            return await apiResults.data;
        } else if (apiResults.status === 404) {
            logger.debug(`ME 404 RESPONSE ${apiResults.message}`);

            throw new Response('Du har ikke opprettet bruker.', {
                status: 406,
                statusText: 'Du har ikke opprettet bruker.',
            });
        } else {
            logger.debug(`Error in ME  ${apiResults.message}`);

            throw new Response('Ingen tilkobling til server', {
                status: 500,
                statusText: 'Ingen brukerdata funnet',
            });
        }
    }

    static async fetchOrganisations() {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/api/contacts/organisations`,
            functionName: 'fetchOrganisations',
        });

        if (apiResults.success) {
            if (apiResults.data.length > 0) {
                return await apiResults.data;
            }
        }
        logger.debug(`No organisations found for user`);

        throw new Response('Du er ikke tilknyttet en organisasjon', {
            status: 401,
            statusText: 'Du er ikke tilknyttet en organisasjon',
        });
    }
}

export default MeApi;
