import { http, HttpResponse } from 'msw';

import { accessHandlers } from './accessHandlers';
import { adaptersHandlers } from './adaptersHandlers';
import { assetsHandlers } from './assetsHandlers';
import { clientsHandlers } from './clientsHandlers';
import { componentsHandlers } from './componentsHandlers';
import { contactsHandlers } from './contactsHandlers';
import { linkWalkerHandlers } from './linkWalkerHandlers';
import { userHandlers } from './userHandlers';

// General handlerDetails
const generalHandlers = [
    http.get('/', () => {
        return HttpResponse.json('from handler in MSW', { status: 200 });
    }),
];

// Combine all handlerDetails
export const handlers = [
    ...generalHandlers,
    ...accessHandlers,
    ...userHandlers,
    ...contactsHandlers,
    ...componentsHandlers,
    ...adaptersHandlers,
    ...clientsHandlers,
    ...assetsHandlers,
    ...linkWalkerHandlers,
];
