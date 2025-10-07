import { NovariApiManager } from 'novari-frontend-components';

import type { IMeData } from '~/types/Me';
import type { IOrganisation } from '~/types/Organisation';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.API_URL || '';

console.log('=== MeApi INITIALIZATION ===');
console.log('API_URL:', API_URL);

const apiManager = new NovariApiManager({
    baseUrl: API_URL,
    logLevel: 'debug',
});

console.log('NovariApiManager created');

class MeApi {
    static async fetchMe(): Promise<IMeData> {
        const xninValue = HeaderProperties.getXnin();
        console.log('=== fetchMe DEBUG START ===');
        console.log('x-nin value from HeaderProperties:', xninValue);
        console.log('x-nin value type:', typeof xninValue);
        console.log('x-nin value length:', xninValue?.length);
        console.log('x-nin is empty?:', !xninValue);
        
        // DIRECT FETCH TEST - bypassing NovariApiManager
        console.log('=== TESTING DIRECT FETCH (bypassing NovariApiManager) ===');
        const testUrl = `${API_URL}/api/me`;
        const testHeaders = {
            'x-nin': xninValue,
            'Content-Type': 'application/json',
        };
        
        console.log('Test URL:', testUrl);
        console.log('Test Headers:', JSON.stringify(testHeaders, null, 2));
        
        try {
            console.log('Calling fetch...');
            const response = await fetch(testUrl, {
                method: 'GET',
                headers: testHeaders,
            });
            
            console.log('Fetch completed!');
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (response.ok) {
                const data = await response.json();
                console.log('SUCCESS! Direct fetch worked. Data:', data);
                console.log('=== fetchMe DEBUG END - SUCCESS ===');
                return data;
            } else {
                const errorText = await response.text();
                console.log('Response not ok. Status:', response.status);
                console.log('Error text:', errorText);
            }
        } catch (error) {
            console.log('FETCH ERROR:', error);
            console.log('Error type:', error instanceof Error ? error.constructor.name : typeof error);
            console.log('Error message:', error instanceof Error ? error.message : String(error));
            if (error instanceof Error && 'cause' in error) {
                console.log('Error cause:', error.cause);
            }
        }
        console.log('=== DIRECT FETCH TEST END ===');
        
        // Original apiManager call
        console.log('=== NOW TRYING apiManager.call ===');
        const headers = {
            'x-nin': xninValue,
        };
        const res = await apiManager.call<IMeData>({
            method: 'GET',
            endpoint: '/api/me',
            functionName: 'fetchMe',
            customErrorMessage: 'Kunne ikke hente brukerdata',
            customSuccessMessage: 'Brukerdata hentet',
            additionalHeaders: headers,
        });

        console.log('apiManager response:', res);
        console.log('=== fetchMe DEBUG END ===');

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
