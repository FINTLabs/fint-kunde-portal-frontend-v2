import { NovariApiManager } from 'novari-frontend-components';

import type { IMeData } from '~/types/Me';
import type { IOrganisation } from '~/types/Organisation';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.API_URL || '';

const apiManager = new NovariApiManager({
    baseUrl: API_URL,
});

class MeApi {
    static async fetchMe(): Promise<IMeData> {
        //TODO: should we check xnin before going further?
        // if (!HeaderProperties.getXnin()) {
        //     throw new Response('Login informasjon mangler. Vennligst logg inn på nytt.', {
        //         status: 500,
        //         statusText: 'Login informasjon mangler. Vennligst logg inn på nytt.',
        //     });
        // }

        const res = await apiManager.call<IMeData>({
            method: 'GET',
            endpoint: '/api/me',
            functionName: 'fetchMe',
            customErrorMessage: 'Kunne ikke hente brukerdata',
            customSuccessMessage: 'Brukerdata hentet',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });

        if (res.success && res.data) {
            return res.data;
        }

        if (res.status === 404) {
            // translate 404 -> 406 for the app
            throw new Response('Du har ikke opprettet bruker.', {
                status: 406,
                statusText: 'Du har ikke opprettet bruker.',
            });
        }

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
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });

        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            return res.data;
        }

        throw new Response('Du er ikke tilknyttet en organisasjon', {
            status: 401,
            statusText: 'Du er ikke tilknyttet en organisasjon',
        });
    }
}

export default MeApi;
