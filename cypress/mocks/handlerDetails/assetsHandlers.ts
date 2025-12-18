import { http, HttpResponse } from 'msw';

import resource from '../../fixtures/resource.json';
import resources from '../../fixtures/resources.json';
import primaryResource from '../../fixtures/primaryResource.json';
import { API_URL } from '../mockConfig';

export const assetsHandlers = [
    http.get(`${API_URL}/api/assets/calvin_organizations/primary`, () => {
        return HttpResponse.json(primaryResource);
    }),
    http.get(`${API_URL}/api/assets/calvin_organizations/`, () => {
        return HttpResponse.json(resources);
    }),

    http.post(`${API_URL}/api/assets/fintlabs.no/`, async () => {
        // const body = await request.json();

        // Return a mock created resource response
        const newResource = {
            id: `test-resource-${Date.now()}`,
            name: 'test',
            description: 'Test Description',
            orgName: 'calvin_organizations',
        };

        return HttpResponse.json(newResource, { status: 201 });
    }),

    http.get(`${API_URL}/api/assets/calvin_organizations/udehenrik_fintlabs_no`, () => {
        return HttpResponse.json(resource);
    }),

    http.put(`${API_URL}/api/assets/calvin_organizations/udehenrik_fintlabs_no`, () => {
        return HttpResponse.json('from handler in MSW', { status: 200 });
    }),

    http.put(
        `${API_URL}/api/assets/calvin_organizations/udehenrik_fintlabs_no/adapters/jennifer-another-test@adapter.fintlabs.no`,
        () => {
            return HttpResponse.json('from handler in MSW', { status: 200 });
        }
    ),
];
