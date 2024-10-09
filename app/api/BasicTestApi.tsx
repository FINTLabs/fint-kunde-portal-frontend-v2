import { request } from '~/api/shared/api'; // Assuming this is your request helper function
import { IBasisTest } from '~/types/BasisTest';
import { API_URL } from '~/api/constants';

class LogApi {
    static async runTest(orgName: string, status: string, component: string, time: string) {
        const testBody: IBasisTest = {
            status,
            component,
            time,
        };

        const URL = `${API_URL}/api/tests/${orgName}/basic`;
        const functionName = 'runBasicTest';

        return await request(URL, functionName, 'POST', 'json', testBody);
    }
}

export default LogApi;
