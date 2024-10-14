import { request } from '~/api/shared/api';
import { IBasicTest } from '~/types/BasicTest'; // Assuming this is your request helper function
const API_URL = process.env.TEST_RUNNER_API_URL;

class BasicTestApi {
    static async runTest(orgName: string, baseUrl: string, endpoint: string, clientName: string) {
        const testBody: IBasicTest = {
            baseUrl,
            endpoint,
            clientName,
        };

        const URL = `${API_URL}/test-runner/${orgName}/run`;
        const functionName = 'runBasicTest';

        return await request(URL, functionName, 'POST', 'json', testBody);
    }
}

export default BasicTestApi;
