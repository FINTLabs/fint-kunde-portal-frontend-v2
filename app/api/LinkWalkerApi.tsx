import { request } from '~/api/shared/api';

const API_URL = process.env.LINKWALKER_API_URL;

class LinkWalkerApi {
    static async getTests(orgName: string) {
        const functionName = 'getTests';
        const URL = `${API_URL}/link-walker/tasks/${orgName}`;
        return request(URL, functionName, 'GET', 'json');
    }

    static getLink(orgName: string, resultId: string) {
        return `${API_URL}/link-walker/tasks/${orgName}/${resultId}/download`;
    }

    static async addTest(testUrl: string, clientName: string, orgName: string) {
        const functionName = 'addTest';
        const URL = `${API_URL}/link-walker/tasks/${orgName}`;

        const data = {
            url: testUrl,
            client: clientName,
        };

        console.log('.......... link walker', data, URL);
        return request(URL, functionName, 'POST', 'json', data);
    }
}

export default LinkWalkerApi;
