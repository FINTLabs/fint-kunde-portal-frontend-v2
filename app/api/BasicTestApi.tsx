import { request } from '~/api/shared/api'; // Assuming this is your request helper function
import { IBasisTest } from '~/types/BasisTest';

const API_URL = process.env.TEST_RUNNER_API_URL

class LogApi {
    static async runTest(orgName: string, status: string, component: string, time: string) {
        const testBody: IBasisTest = {
            status,
            component,
            time,
        };

        const URL = `${API_URL}/test-runner/${orgName}/basic`;
        const functionName = 'runBasicTest';

        return await request(URL, functionName, 'POST', 'json', testBody);
    }
}

export default LogApi;
