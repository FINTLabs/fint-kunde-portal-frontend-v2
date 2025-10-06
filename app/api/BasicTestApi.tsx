import { NovariApiManager, ApiResponse } from 'novari-frontend-components';

import type { IBasicTest } from '~/types/BasicTest';
import { HeaderProperties } from '~/utils/headerProperties';

const TEST_RUNNER_API_URL = process.env.TEST_RUNNER_API_URL || '';
const testManager = new NovariApiManager({
    baseUrl: TEST_RUNNER_API_URL,
});

class BasicTestApi {
    private static async postTest<T>(
        orgName: string,
        path: 'run' | 'health',
        functionName: string,
        body: IBasicTest,
        successMsg: string,
        errorMsg: string
    ): Promise<ApiResponse<T>> {
        return await testManager.call<T>({
            method: 'POST',
            endpoint: `/test-runner/${orgName}/${path}`,
            functionName,
            body: JSON.stringify(body),
            customErrorMessage: errorMsg,
            customSuccessMessage: successMsg,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async runTest(
        orgName: string,
        baseUrl: string,
        endpoint: string,
        clientName: string
    ): Promise<ApiResponse<IBasicTest>> {
        const testBody: IBasicTest = {
            baseUrl,
            endpoint,
            ...(clientName && { clientName }),
        };

        return this.postTest<IBasicTest>(
            orgName,
            'run',
            'runBasicTest',
            testBody,
            'Basistesten ble kjørt.',
            'Kunne ikke kjøre basistesten'
        );
    }

    static async runHealthTest(
        orgName: string,
        baseUrl: string,
        endpoint: string,
        clientName: string
    ): Promise<ApiResponse<IBasicTest>> {
        const testBody: IBasicTest = {
            baseUrl,
            endpoint,
            ...(clientName && { clientName }),
        };

        return this.postTest<IBasicTest>(
            orgName,
            'health',
            'runHealthTest',
            testBody,
            'Helsesjekken ble kjørt.',
            'Kunne ikke kjøre helsesjekken'
        );
    }
}

export default BasicTestApi;
