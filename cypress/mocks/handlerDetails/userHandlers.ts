import { http, HttpResponse } from 'msw';

import feature from '../../fixtures/features.json';
import me from '../../fixtures/me.json';
import role from '../../fixtures/role.json';
import { API_URL } from '../mockConfig';

export const userHandlers = [
    http.get(`${API_URL}/api/api/feature`, () => {
        return HttpResponse.json(feature);
    }),

    http.get(`${API_URL}/api/me`, () => {
        return HttpResponse.json(me);
    }),

    http.get(`${API_URL}/api/role`, () => {
        return HttpResponse.json(role);
    }),
];
