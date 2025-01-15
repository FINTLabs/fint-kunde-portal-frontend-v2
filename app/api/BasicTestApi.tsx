import { apiManager, ApiResponse } from '~/api/ApiManager';
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
            ...(clientName && { clientName }),
        };

        const apiResults = await apiManager<any>({
            method: 'POST',
            url: `${API_URL}/test-runner/${orgName}/run`,
            functionName: 'runBasicTest',
            body: JSON.stringify(testBody),
        });

        // return handleApiResponse<any>(
        //     apiResults,
        //     'Kunne ikke kjøre basistesten',
        //     'Basistesten ble kjørt.',
        //     'success'
        // );
        if (!apiResults.success) {
            logger.debug('returning error!');
            return {
                success: false,
                message: 'Kunne ikke kjøre basistesten',
                variant: 'error',
            };
        }

        return {
            success: true,
            message: 'Helsesjekken ble kjørt.',
            variant: 'success',
            data: apiResults.data,
        };
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

        // return handleApiResponse<any>(
        //     apiResults,
        //     'Kunne ikke kjøre helsesjekken',
        //     'Helsesjekken ble kjørt.',
        //     'success'
        // );

        if (!apiResults.success) {
            return {
                success: false,
                message: 'Kunne ikke kjøre helsesjekken',
                variant: 'error',
            };
        }

        return {
            success: true,
            message: 'Helsesjekken ble kjørt.',
            variant: 'success',
            data: apiResults.data,
        };
    }
}

export default BasicTestApi;
