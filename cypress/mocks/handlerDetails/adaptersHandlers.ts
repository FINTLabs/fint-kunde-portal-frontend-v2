import { http, HttpResponse } from 'msw';

import adapters from '../../fixtures/adapters.json';

const API_URL = process.env.API_URL;

export const adaptersHandlers = [
    http.get(`${API_URL}/api/adapters/calvin_organizations`, () => {
        return HttpResponse.json(adapters);
    }),

    http.post(`${API_URL}/api/adapters/calvin_organizations`, async ({ request }) => {
        console.log('POST CREATE ADAPTER');
        console.log('request', request);
        // const body = await request.json() as Record<string, any>;
        // console.log('Adapter creation request body:', body);
        //
        // // Return a mock created adapter response
        // const newAdapter = {
        //     id: `test-${Date.now()}@adapter.fintlabs.no`,
        //     name: body?.name || 'Test Adapter',
        //     description: body?.description || 'Test Description',
        //     detailedInfo: body?.detailedInfo || 'Test Detailed Info',
        //     orgName: 'calvin_organizations'
        // };

        return HttpResponse.json('newAdapter', { status: 201 });
    }),

    http.put(
        `${API_URL}/api/adapters/calvin_organizations/jennifer-another-test@adapter.fintlabs.no`,
        () => {
            return HttpResponse.json('from handler in MSW', { status: 200 });
        }
    ),
];
