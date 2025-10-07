import { NovariApiManager } from 'novari-frontend-components';

import type { IMeData } from '~/types/Me';
import type { IOrganisation } from '~/types/Organisation';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.API_URL || '';

const apiManager = new NovariApiManager({
    baseUrl: API_URL,
    logLevel: 'debug', // Enable debug logging to see headers being sent
});

class MeApi {
    static async fetchMe(): Promise<IMeData> {
        const xninValue = HeaderProperties.getXnin();
        console.log('=== fetchMe DEBUG START ===');
        console.log('x-nin value from HeaderProperties:', xninValue);
        console.log('x-nin value type:', typeof xninValue);
        console.log('x-nin value length:', xninValue?.length);
        console.log('x-nin is empty?:', !xninValue);
        
        const headers = {
            'x-nin': xninValue,
        };
        console.log('Headers object being passed:', JSON.stringify(headers));
        
        // TEST: Direct fetch to see if backend receives the header
        console.log('=== DIRECT FETCH TEST START ===');
        try {
            const directUrl = `${API_URL}/api/me`;
            console.log('Direct fetch URL:', directUrl);
            console.log('Direct fetch headers:', headers);
            
            const directResponse = await fetch(directUrl, {
                method: 'GET',
                headers: {
                    'x-nin': xninValue,
                    'Content-Type': 'application/json',
                },
            });
            
            console.log('Direct fetch status:', directResponse.status);
            console.log('Direct fetch statusText:', directResponse.statusText);
            console.log('Direct fetch headers sent:', {
                'x-nin': xninValue,
                'Content-Type': 'application/json',
            });
            
            if (directResponse.ok) {
                const directData = await directResponse.json();
                console.log('Direct fetch SUCCESS! Data:', directData);
                console.log('=== DIRECT FETCH TEST END - SUCCESS ===');
                return directData;
            } else {
                const errorText = await directResponse.text();
                console.log('Direct fetch FAILED. Error:', errorText);
            }
        } catch (directError) {
            console.log('Direct fetch ERROR:', directError);
        }
        console.log('=== DIRECT FETCH TEST END ===');
        
        // Original apiManager call
        const res = await apiManager.call<IMeData>({
            method: 'GET',
            endpoint: '/api/me',
            functionName: 'fetchMe',
            customErrorMessage: 'Kunne ikke hente brukerdata',
            customSuccessMessage: 'Brukerdata hentet',
            additionalHeaders: headers,
        });

        console.log('Response received:', res);
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
