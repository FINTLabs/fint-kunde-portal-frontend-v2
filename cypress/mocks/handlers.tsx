import { http, HttpResponse } from 'msw';
import feature from '../fixtures/features.json';
import organisations from '../fixtures/organisations.json';
import me from '../fixtures/me.json';
import contactsTechnical from '../fixtures/contactsTechnical.json';
import role from '../fixtures/role.json';
import contactsLegal from '../fixtures/contactsLegal.json';
import contacts from '../fixtures/contacts.json';
import components from '../fixtures/components.json';
import adapters from '../fixtures/adapters.json';
import adapter from '../fixtures/adapter.json';
import clients from '../fixtures/clients.json';
import resources from '../fixtures/resources.json';
import resource from '../fixtures/resource.json';
import configurations from '../fixtures/configurations.json';

import walker from '../fixtures/walker.json';

const API_URL = process.env.API_URL;
const LINKWALKER_API_URL = process.env.LINKWALKER_API_URL;

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

    http.get(`${API_URL}/api/components`, () => {
        console.log('GET ALL COMPONENTS');
        return HttpResponse.json(components);
    }),

    http.get(`${API_URL}/api/adapters/calvin_organizations`, () => {
        return HttpResponse.json(adapters);
    }),

    http.put(
        `${API_URL}/api/organisations/calvin_organizations/contacts/technical/f5e6d4c8b7a9f1e2d3b4c6a7e1f5b8d9`,
        async ({ request }) => {
            return HttpResponse.json('from handler in MSW', { status: 200 });
        }
    ),

    http.post(`${API_URL}/api/adapters/calvin_organizations`, async ({ request }) => {
        console.log('HERE-----');
        return HttpResponse.json(adapter);
    }),

    http.get(`${API_URL}/api/components/organisation/calvin_organizations`, () => {
        return HttpResponse.json(components);
    }),

    http.get(`${API_URL}/api/clients/calvin_organizations`, () => {
        return HttpResponse.json(clients);
    }),

    http.get(`${API_URL}/api/assets/calvin_organizations/`, () => {
        return HttpResponse.json(resources);
    }),

    http.get(`${API_URL}/api/assets/calvin_organizations/udehenrik_fintlabs_no`, () => {
        return HttpResponse.json(resource);
    }),

    http.get(`${API_URL}/api/components/configurations`, () => {
        return HttpResponse.json(configurations);
    }),

    http.get(`${LINKWALKER_API_URL}/link-walker/tasks/calvin_organizations`, () => {
        return HttpResponse.json(walker);
    }),

    //GET http://localhost:8086/link-walker/tasks/calvin_organizations

    http.put(
        `${API_URL}/api/components/organisation/calvin_organizations/administrasjon_fullmakt/adapters/jennifer-another-test@adapter.fintlabs.no`,
        () => {
            return HttpResponse.json('components');
        }
    ),

    http.put(
        `${API_URL}/api/adapters/calvin_organizations/jennifer-another-test@adapter.fintlabs.no`,
        () => {
            return HttpResponse.json('from handler in MSW', { status: 200 });
        }
    ),

    http.put(
        `${API_URL}/api/components/organisation/calvin_organizations/administrasjon_fullmakt/clients/jennifer-test-test@client.fintlabs.no`,
        () => {
            return HttpResponse.json('from handler in MSW', { status: 200 });
        }
    ),

    http.put(
        `${API_URL}/api/clients/calvin_organizations/jennifer-test-test@client.fintlabs.no`,
        () => {
            return HttpResponse.json('from handler in MSW', { status: 200 });
        }
    ),

    http.put(`${API_URL}/api/assets/calvin_organizations/udehenrik_fintlabs_no`, () => {
        return HttpResponse.json('from handler in MSW', { status: 200 });
    }),

    http.put(
        `${API_URL}/api/assets/calvin_organizations/udehenrik_fintlabs_no/adapters/jennifer-another-test@adapter.fintlabs.no`,
        () => {
            return HttpResponse.json('from handler in MSW', { status: 200 });
        }
    ),

    //   PUT http://localhost:8080
];
