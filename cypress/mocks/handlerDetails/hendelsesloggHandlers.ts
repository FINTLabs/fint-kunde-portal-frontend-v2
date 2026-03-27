import { http, HttpResponse } from 'msw';

import events from '../../fixtures/events.json';
import { API_URL } from '../mockConfig';

export const eventsHandlers = [
    http.get(
        `${API_URL}/api/events/calvin_organizations/api/utdanning-elev/GET_ALL_BASISGRUPPE`,
        () => {
            return HttpResponse.json(events);
        }
    ),
];
