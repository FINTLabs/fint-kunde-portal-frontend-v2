import { http, HttpResponse } from 'msw';

import walker from '../../fixtures/walker.json';
import { LINKWALKER_API_URL } from '../mockConfig';

export const linkWalkerHandlers = [
    http.get(`${LINKWALKER_API_URL}/link-walker/tasks/calvin_organizations`, () => {
        return HttpResponse.json(walker);
    }),
];
