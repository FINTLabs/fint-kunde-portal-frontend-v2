import { http, HttpResponse } from 'msw';

import clients from '../../fixtures/clients.json';
import { API_URL } from '../mockConfig';

export const clientsHandlers = [
    http.get(`${API_URL}/api/clients/calvin_organizations`, () => {
        return HttpResponse.json(clients);
    }),

    http.post(`${API_URL}/api/clients/calvin_organizations`, async ({ request }) => {
        const body = await request.json();
        //eslint-disable-next-line no-console
        console.log('Client creation request body:', body);
        return HttpResponse.json('from handler in MSW', { status: 200 });
    }),

    http.put(`${API_URL}/api/clients/jennifer-test-test@client.fintlabs.no`, () => {
        return HttpResponse.json('from handler in MSW', { status: 200 });
    }),
];
