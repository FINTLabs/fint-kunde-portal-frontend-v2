import { NovariApiManager, type ApiResponse } from 'novari-frontend-components';

import type { ILinkWalkerTest } from '~/types';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.LINKWALKER_API_URL || '';
const linkWalkerManager = new NovariApiManager({
    baseUrl: API_URL,
});

class LinkWalkerApi {
    static async getTests(orgName: string): Promise<ApiResponse<ILinkWalkerTest[]>> {
        return await linkWalkerManager.call<ILinkWalkerTest[]>({
            method: 'GET',
            endpoint: `/link-walker/tasks/${orgName}`,
            functionName: 'getTests',
            customErrorMessage: `Kunne ikke hente tester for organisasjonen: ${orgName}`,
            customSuccessMessage: `Tester for organisasjonen ${orgName} ble hentet.`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static getLink(orgName: string, resultId: string): string {
        return `${API_URL}/link-walker/tasks/${orgName}/${resultId}/download`;
    }

    static async addTest(
        testUrl: string,
        clientName: string,
        orgName: string
    ): Promise<ApiResponse<void>> {
        const data = { url: testUrl, client: clientName };

        return await linkWalkerManager.call<void>({
            method: 'POST',
            endpoint: `/link-walker/tasks/${orgName}`,
            functionName: 'addTest',
            body: JSON.stringify(data),
            customErrorMessage: `Kunne ikke legge til testen for organisasjonen: ${orgName}`,
            customSuccessMessage: `Testen for organisasjonen ${orgName} ble lagt til.`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async clearTests(orgName: string): Promise<ApiResponse<void>> {
        return await linkWalkerManager.call<void>({
            method: 'PUT',
            endpoint: `/link-walker/tasks/${orgName}`,
            functionName: 'clearTests',
            customErrorMessage: `Kunne ikke tømme testene for organisasjonen: ${orgName}`,
            customSuccessMessage: `Testene for organisasjonen ${orgName} ble tømt.`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }
}

export default LinkWalkerApi;
