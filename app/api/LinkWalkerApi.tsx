import { request } from '~/api/shared/api';
import { error, log } from '~/utils/logger';

const API_URL = process.env.LINKWALKER_API_URL;

class LinkWalkerApi {
    static async getTests(orgName: string) {
        const functionName = 'getTests';
        const URL = `${API_URL}/link-walker/tasks/${orgName}`;
        return request(URL, functionName).catch((err) => {
            error('Error fetching relations tests :', err);
        });
    }

    static getLink(orgName: string, resultId: string) {
        return `${API_URL}/link-walker/tasks/${orgName}/${resultId}/download`;
    }

    static async addTest(testUrl: string, clientName: string, orgName: string) {
        const request = new Request(`${API_URL}/link-walker/tasks/${orgName}`, {
            method: 'POST',
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
                'x-nin': process.env.PERSONALNUMBER || '',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                url: testUrl,
                client: clientName,
            }),
        });

        return fetch(request).then((response) => {
            if (response.ok) {
                log('link walker request ok');
                return response;
            } else {
                error('error with linkwalker');
                throw new Error(`LinkWalker not ok: ${response.status}`);
            }
        });
    }
}

export default LinkWalkerApi;
