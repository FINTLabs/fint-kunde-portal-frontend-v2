import { apiManager, ApiResponse, handleApiResponse } from '~/api/ApiManager';
import logger from '~/utils/logger';

const API_URL = process.env.ACCESS_URL;

class AccessApi {
    static async getClientorAdapterAccess(name: string): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/access/${name}`,
            functionName: 'getClientorAdapterAccess',
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke hente tilgang for: ${name}`,
            `Tilgang for ${name} ble hentet.`,
            'success'
        );
    }
    static async getClientorAdapterAccessComponents(name: string): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/access/${name}/component`,
            functionName: 'getClientorAdapterAccess',
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke hente tilgang for: ${name}`,
            `Tilgang for ${name} ble hentet.`,
            'success'
        );
    }

    static async getComponentAccess(
        name: string,
        clientOrAdapter: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/access/${clientOrAdapter}/${name}`,
            functionName: 'getComponentAccess',
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke hente komponenttilgang for: ${name}`,
            `Komponenttilgang for ${name} ble hentet.`,
            'success'
        );
    }

    static async getFieldAccess(
        clientOrAdapter: string,
        componentName: string,
        resourceName: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/access/${clientOrAdapter}/${componentName}/${resourceName}`,
            functionName: 'getFieldAccess',
        });

        logger.info('Field list:', apiResults.data);
        return handleApiResponse(
            apiResults,
            `Kunne ikke hente felttilgang for: ${resourceName}`,
            `Felttilgang for ${resourceName} ble hentet.`,
            'success'
        );
    }

    static async updateEnvironments(
        username: string,
        allowedEnvironments: string[]
    ): Promise<ApiResponse<any>> {
        logger.silly(`Envs: ${JSON.stringify(allowedEnvironments, null, 2)}`);
        const apiResults = await apiManager<any>({
            method: 'POST',
            url: `${API_URL}/access/${username}`,
            functionName: 'createAdapter',
            body: JSON.stringify({ allowedEnvironments, username: username, isAdapter: false }),
        });

        return handleApiResponse(apiResults, 'Kunne ikke endre miljøer', 'Miljøer ble oppdatert');
    }
}

export default AccessApi;
