import logger from '~/utils/logger';
import { NovariApiManager } from 'novari-frontend-components';
import type { IMeData } from '~/types/Me';
import type { IOrganisation } from '~/types/Organisation';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.API_URL || '';

const apiManager = new NovariApiManager({
    baseUrl: API_URL,
    defaultHeaders: {
        'x-nin': HeaderProperties.getXnin(),
    },
});

class MeApi {
    static async fetchMe(): Promise<IMeData> {
        const res = await apiManager.call<IMeData>({
            method: 'GET',
            endpoint: '/api/me',
            functionName: 'fetchMe',
            customErrorMessage: 'Kunne ikke hente brukerdata',
            customSuccessMessage: 'Brukerdata hentet',
        });

        if (res.success && res.data) {
            return res.data;
        }

        if (res.status === 404) {
            logger.debug(`ME 404 RESPONSE ${res.message}`);
            // translate 404 -> 406 for the app
            throw new Response('Du har ikke opprettet bruker.', {
                status: 406,
                statusText: 'Du har ikke opprettet bruker.',
            });
        }

        logger.debug(`Error in ME ${res.message}`);
        throw new Response('Ingen tilkobling til server', {
            status: 500,
            statusText: 'Ingen brukerdata funnet',
        });
    }

    static async fetchOrganisations(): Promise<IOrganisation[]> {
        const res = await apiManager.call<IOrganisation[]>({
            method: 'GET',
            endpoint: '/api/contacts/organisations',
            functionName: 'fetchOrganisations',
            customErrorMessage: 'Kunne ikke hente organisasjoner',
            customSuccessMessage: 'Organisasjoner hentet',
        });

        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            return res.data;
        }

        logger.debug('No organisations found for user');
        throw new Response('Du er ikke tilknyttet en organisasjon', {
            status: 401,
            statusText: 'Du er ikke tilknyttet en organisasjon',
        });
    }
}

export default MeApi;
