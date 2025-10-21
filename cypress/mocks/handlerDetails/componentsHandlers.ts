import { http, HttpResponse } from 'msw';

import components from '../../fixtures/components.json';
import configurations from '../../fixtures/configurations.json';
import { API_URL } from '../mockConfig';

export const componentsHandlers = [
    http.get(`${API_URL}/api/components`, () => {
        console.log('GET ALL COMPONENTS');
        return HttpResponse.json(components);
    }),

    http.get(`${API_URL}/api/components/organisation/calvin_organizations`, () => {
        return HttpResponse.json(components);
    }),

    http.get(`${API_URL}/api/components/configurations`, () => {
        return HttpResponse.json(configurations);
    }),

    http.put(
        `${API_URL}/api/components/organisation/calvin_organizations/administrasjon_fullmakt/adapters/jennifer-another-test@adapter.fintlabs.no`,
        () => {
            return HttpResponse.json('components');
        }
    ),

    http.put(
        `${API_URL}/api/components/organisation/calvin_organizations/administrasjon_fullmakt/clients/jennifer-test-test@client.fintlabs.no`,
        () => {
            return HttpResponse.json('from handler in MSW', { status: 200 });
        }
    ),
];
