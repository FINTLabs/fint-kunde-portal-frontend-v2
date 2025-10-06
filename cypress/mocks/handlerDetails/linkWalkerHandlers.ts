import { http, HttpResponse } from 'msw';

import walker from '../../fixtures/walker.json';

const LINKWALKER_API_URL = process.env.LINKWALKER_API_URL;

export const linkWalkerHandlers = [
    http.get(`${LINKWALKER_API_URL}/link-walker/tasks/calvin_organizations`, () => {
        return HttpResponse.json(walker);
    }),
];
