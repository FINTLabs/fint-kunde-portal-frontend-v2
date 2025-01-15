import { apiManager, handleApiResponse, ApiResponse } from '~/api/ApiManager';
import logger from '~/utils/logger';

const API_URL = process.env.LINKWALKER_API_URL;

class LinkWalkerApi {
    static async getTests(orgName: string): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/link-walker/tasks/${orgName}`,
            functionName: 'getTests',
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke hente tester for organisasjonen: ${orgName}`,
            `Tester for organisasjonen ${orgName} ble hentet.`,
            'success'
        );
    }

    static getLink(orgName: string, resultId: string): string {
        return `${API_URL}/link-walker/tasks/${orgName}/${resultId}/download`;
    }

    static async addTest(
        testUrl: string,
        clientName: string,
        orgName: string
    ): Promise<ApiResponse<any>> {
        const data = {
            url: testUrl,
            client: clientName,
        };

        const apiResults = await apiManager<any>({
            method: 'POST',
            url: `${API_URL}/link-walker/tasks/${orgName}`,
            functionName: 'addTest',
            body: JSON.stringify(data),
        });

        // return handleApiResponse(
        //     apiResults,
        //     `Kunne ikke legge til testen for organisasjonen: ${orgName}`,
        //     `Testen for organisasjonen ${orgName} ble lagt til.`,
        //     'success'
        // );

        if (!apiResults.success) {
            logger.debug('returning error!');
            return {
                success: false,
                message: `Kunne ikke legge til testen for organisasjonen: ${orgName}`,
                variant: 'error',
            };
        }

        return {
            success: true,
            message: `Testen for organisasjonen ${orgName} ble lagt til.`,
            variant: 'success',
        };
    }

    static async clearTests(orgName: string): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'PUT',
            url: `${API_URL}/link-walker/tasks/${orgName}`,
            functionName: 'clearTests',
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke tømme testene for organisasjonen: ${orgName}`,
            `Testene for organisasjonen ${orgName} ble tømt.`,
            'success'
        );
    }
}

export default LinkWalkerApi;
