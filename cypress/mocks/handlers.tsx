import { http, HttpResponse } from 'msw';
import feature from '../fixtures/features.json';
import organisations from '../fixtures/organisations.json';
import me from '../fixtures/me.json';
import contactsTechnical from '../fixtures/contactsTechnical.json';
import role from '../fixtures/role.json';
import contactsLegal from '../fixtures/contactsLegal.json';
import contacts from '../fixtures/contacts.json';

const API_URL = process.env.API_URL;
console.log(' api url', API_URL);

export const handlers = [
    http.get(`${API_URL}/api/api/feature`, () => {
        return HttpResponse.json(feature);
    }),

    http.get(`${API_URL}/api/contacts`, () => {
        return HttpResponse.json(contacts);
    }),

    http.get(`${API_URL}/api/contacts/organisations`, () => {
        return HttpResponse.json(organisations);
    }),

    http.get(`${API_URL}/api/me`, () => {
        return HttpResponse.json(me);
    }),

    http.get(`${API_URL}/api/organisations/calvin_organizations/contacts/technical`, () => {
        return HttpResponse.json(contactsTechnical);
    }),

    http.get(`${API_URL}/api/role`, () => {
        return HttpResponse.json(role);
    }),

    http.get(`${API_URL}/api/organisations/calvin_organizations/contacts/legal`, () => {
        return HttpResponse.json(contactsLegal);
    }),
];
