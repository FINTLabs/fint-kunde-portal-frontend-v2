import { http, HttpResponse } from 'msw';

import feature from '../../fixtures/features.json';
import me from '../../fixtures/me.json';
import role from '../../fixtures/role.json';

const API_URL = process.env.API_URL;

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
