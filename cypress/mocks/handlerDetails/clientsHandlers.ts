import { http, HttpResponse } from 'msw';

import clients from '../../fixtures/clients.json';

const API_URL = process.env.API_URL;

export const clientsHandlers = [
    http.get(`${API_URL}/api/clients/calvin_organizations`, () => {
        console.log('GET ALL CLIENTS');
        return HttpResponse.json(clients);
    }),

    http.post(`${API_URL}/api/clients/calvin_organizations`, async ({ request }) => {
        console.log('POST CREATE CLIENT');
        const body = await request.json();
        console.log('Client creation request body:', body);
        return HttpResponse.json('from handler in MSW', { status: 200 });
    }),

    http.put(
        `${API_URL}/api/clients/calvin_organizations/jennifer-test-test@client.fintlabs.no`,
        () => {
            return HttpResponse.json('from handler in MSW', { status: 200 });
        }
    ),
];
