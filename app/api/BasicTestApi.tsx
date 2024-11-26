import { request } from '~/api/shared/api';
import { IBasicTest } from '~/types/BasicTest';
import logger from '~/utils/logger'; // Assuming this is your request helper function
const API_URL = process.env.TEST_RUNNER_API_URL;

class BasicTestApi {
    static async runTest(orgName: string, baseUrl: string, endpoint: string, clientName: string) {
        const testBody: IBasicTest = {
            baseUrl,
            endpoint,
            clientName,
        };

        console.log('........Running basic test ', testBody);
        const URL = `${API_URL}/test-runner/${orgName}/run`;
        const functionName = 'runBasicTest';

        return await request(URL, functionName, 'POST', 'json', testBody);
    }

    static async runHealthTest(
        orgName: string,
        baseUrl: string,
        endpoint: string,
        clientName: string
    ) {
        const testBody: IBasicTest = {
            baseUrl,
            endpoint,
            clientName,
        };

        logger.debug('.........Running health test ', testBody.baseUrl);
        const URL = `${API_URL}/test-runner/${orgName}/health`;
        const functionName = 'runBasicTest';

        return await request(URL, functionName, 'POST', 'json', testBody);
    }
}

export default BasicTestApi;
