import { apiManager, handleApiResponse, ApiResponse } from '~/api/ApiManager';
const API_URL = process.env.API_URL;

class ComponentConfigApi {
    static async getComponentConfigs(): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/api/components/configurations`,
            functionName: 'getComponentConfigs',
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke hente komponentkonfigurasjoner',
            'Komponentkonfigurasjoner ble hentet.',
            'success'
        );
    }
}

export default ComponentConfigApi;
