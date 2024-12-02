import { request } from '~/api/shared/api';
import { API_URL } from './constants';
import { HeaderProperties } from '~/utils/headerProperties';
import logger from '~/utils/logger';

class MeApi {
    static async fetchMe() {
        const functionName = 'fetchMe';
        const URL = `${API_URL}/api/me`;

        const requestOptions: RequestInit = {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'x-nin': HeaderProperties.getXnin(),
                Cookie: HeaderProperties.getCookie(),
            },
        };

        try {
            const response = await fetch(URL, requestOptions);
            if (response.ok) {
                return await response.json();
            } else if (response.status === 404) {
                logger.debug(`ME 404 RESPONSE ${response.body}`);

                throw {
                    status: 999,
                    body: 'Du har ikke opprettet bruker.',
                };
            }
        } catch (err) {
            if (err && typeof err === 'object' && 'status' in err && 'body' in err) {
                const errorStatus = err.status as number;
                const errorBody = err.body as string;
                logger.error(`----> Error in MeAPI: ${errorStatus}`);

                throw new Response(errorBody, {
                    status: errorStatus,
                    statusText: errorBody,
                });
            }
            const errorMessage = `Internal Server Error - ${functionName} failed`;
            logger.error(`Error in MeAPI-->: ${errorMessage}`);
            throw new Response(errorMessage, {
                status: 500,
                statusText: 'Beklager, noe gikk galt.',
            });
        }
    }

    static async fetchOrganisations() {
        const functionName = 'fetchOrganisations';
        const URL = `${API_URL}/api/contacts/organisations`;

        return request(URL, functionName);
    }
}

export default MeApi;
