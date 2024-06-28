import { error, log } from '~/utils/logger';
import {API_URL} from "~/api/constants";

export default class ZenDeskApi {
    static async getPriority() {
        const url = `${API_URL}/zendesk/tickets/priority`;
        log('Fetching priority information', url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'x-nin': process.env.PERSONALNUMBER || '',
                },
            });

            if (response.redirected) {
                log('Priority Request was redirected:', response.url);
            }

            if (response.ok) {
                return await response.json();
            } else {
                error('Error fetching priority information', response.status);
                return 'try-error';
            }
        } catch (err) {
            log(err);
            error('Error fetching priority information:', err);
            return 'catch-error';
        }
    }

    static async getType() {
        const url = `${API_URL}/zendesk/tickets/type`;
        log('Fetching type information', url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'x-nin': process.env.PERSONALNUMBER || '',
                },
            });

            if (response.redirected) {
                log('Type Request was redirected:', response.url);
            }

            if (response.ok) {
                return await response.json();
            } else {
                error('Error fetching type information', response.status);
                return 'try-error';
            }
        } catch (err) {
            log(err);
            error('Error fetching type information:', err);
            return 'catch-error';
        }
    }

    // static async createTicket(ticket) {
    //     const url = `${API_URL}/zendesk/tickets`;
    //     log("Creating new ticket", url);
    //
    //     try {
    //         const response = await fetch(url, {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': '*/*',
    //                 'Content-Type': 'application/json',
    //             },
    //             credentials: 'same-origin',
    //             body: JSON.stringify(ticket),
    //         });
    //
    //         if (response.redirected) {
    //             log("Create Ticket Request was redirected:", response.url);
    //         }
    //
    //         if (response.ok) {
    //             return await response.json();
    //         } else {
    //             error("Error creating ticket", response.status);
    //             return "try-error";
    //         }
    //     } catch (err) {
    //         log(err);
    //         error("Error creating ticket:", err);
    //         return "catch-error";
    //     }
    // }
}
