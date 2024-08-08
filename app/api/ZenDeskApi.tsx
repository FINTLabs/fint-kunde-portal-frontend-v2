import { request } from '~/api/shared/api';
import { API_URL } from '~/api/constants';

export default class ZenDeskApi {
    static async getPriority() {
        const functionName = 'getPriority';
        const URL = `${API_URL}/zendesk/tickets/priority`;
        return request(URL, functionName, '').catch((err) => {
            console.error('Error fetching priority information:', err);
            return 'catch-error';
        });
    }

    static async getType() {
        const functionName = 'getType';
        const URL = `${API_URL}/zendesk/tickets/type`;
        return request(URL, functionName, '').catch((err) => {
            console.error('Error fetching type information:', err);
            return 'catch-error';
        });
    }

    // static async createTicket(ticket) {
    //     const functionName = 'createTicket';
    //     const URL = `${API_URL}/zendesk/tickets`;
    //     return request(URL, functionName, '','POST', 'json', ticket).catch((err) => {
    //         console.error('Error creating ticket:', err);
    //         return 'catch-error';
    //     });
    // }
}
