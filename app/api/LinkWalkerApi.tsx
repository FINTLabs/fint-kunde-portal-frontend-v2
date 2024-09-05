import { request } from '~/api/shared/api';
import { error, log, warn } from '~/utils/logger';

const API_URL = process.env.LINKWALKER_API_URL;

class LinkWalkerApi {
    static async getTests(orgName: string) {
        const functionName = 'getTests';
        const URL = `${API_URL}/link-walker/tasks/${orgName}`;
        return request(URL, functionName).catch((err) => {
            console.error('Error fetching relations tests :', err);
        });
    }

    static getLink(orgName:string, resultId:string){
        console.log('-----------', API_URL)
        return `${API_URL}/link-walker/tasks/${orgName}/${resultId}/download`
    }
    static async addTest(testUrl: string, clientName: string, orgName: string) {
        log('TEST DATA', JSON.stringify(testUrl));

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

        return fetch(request)
            .then((response) => {
                if (response.ok) {
                    return { message: 'test added', variant: 'info' };
                } else {
                    warn('LinkWalker not ok: ', response.status);
                    return {
                        message: 'Error - feil ved tilkobling til server.',
                        variant: 'warning',
                    };
                }
            })
            .catch((e) => {
                error(e.message);
                return {
                    message: 'Det oppsto en feil.',
                    variant: 'error',
                };
            });
    }
}

export default LinkWalkerApi;
