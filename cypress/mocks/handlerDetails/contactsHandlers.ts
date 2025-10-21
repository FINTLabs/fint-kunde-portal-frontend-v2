import { http, HttpResponse } from 'msw';

import contacts from '../../fixtures/contacts.json';
import contactsLegal from '../../fixtures/contactsLegal.json';
import contactsTechnical from '../../fixtures/contactsTechnical.json';
import organisations from '../../fixtures/organisations.json';
import { API_URL } from '../mockConfig';

export const contactsHandlers = [
    http.get(`${API_URL}/api/contacts`, () => {
        return HttpResponse.json(contacts);
    }),

    http.get(`${API_URL}/api/contacts/organisations`, () => {
        return HttpResponse.json(organisations);
    }),

    http.get(`${API_URL}/api/organisations/calvin_organizations/contacts/technical`, () => {
        return HttpResponse.json(contactsTechnical);
    }),

    http.get(`${API_URL}/api/organisations/calvin_organizations/contacts/legal`, () => {
        return HttpResponse.json(contactsLegal);
    }),

    http.put(
        `${API_URL}/api/organisations/calvin_organizations/contacts/technical/f5e6d4c8b7a9f1e2d3b4c6a7e1f5b8d9`,
        async () => {
            return HttpResponse.json('from handler in MSW', { status: 200 });
        }
    ),
];
