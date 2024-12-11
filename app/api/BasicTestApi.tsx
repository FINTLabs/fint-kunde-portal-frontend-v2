import { apiManager, ApiResponse, handleApiResponse } from '~/api/ApiManager';
import logger from '~/utils/logger';
import { IBasicTest } from '~/types/BasicTest';

const API_URL = process.env.TEST_RUNNER_API_URL;

class BasicTestApi {
    static async runTest(
        orgName: string,
        baseUrl: string,
        endpoint: string,
        clientName: string
    ): Promise<ApiResponse<any>> {
        const testBody: IBasicTest = {
            baseUrl,
            endpoint,
            clientName,
        };

        const apiResults = await apiManager<any>({
            method: 'POST',
            url: `${API_URL}/test-runner/${orgName}/run`,
            functionName: 'runBasicTest',
            body: JSON.stringify(testBody),
        });

        return handleApiResponse<any>(
            apiResults,
            'Kunne ikke kjøre basistesten',
            'Basistesten ble kjørt.',
            'success'
        );
    }

    static async runHealthTest(
        orgName: string,
        baseUrl: string,
        endpoint: string,
        clientName: string
    ): Promise<ApiResponse<any>> {
        const testBody: IBasicTest = {
            baseUrl,
            endpoint,
            clientName,
        };

        logger.debug('Running health test', testBody.baseUrl);
        const apiResults = await apiManager<any>({
            method: 'POST',
            url: `${API_URL}/test-runner/${orgName}/health`,
            functionName: 'runHealthTest',
            body: JSON.stringify(testBody),
        });

        return handleApiResponse<any>(
            apiResults,
            'Kunne ikke kjøre helsesjekken',
            'Helsesjekken ble kjørt.',
            'success'
        );
    }
}

export default BasicTestApi;
