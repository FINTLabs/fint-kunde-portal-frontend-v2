import { apiManager, ApiResponse, handleApiResponse } from '~/api/ApiManager';
import logger from '~/utils/logger';
import { IResource } from '~/types/Access';

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
            'success',
            true
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
            'success',
            true
        );
    }

    static async getComponentAccess(
        name: string,
        clientOrAdapter: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/access/${clientOrAdapter}/component/${name}/resource`,
            functionName: 'getComponentAccess',
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke hente komponenttilgang for: ${name}`,
            `Komponenttilgang for ${name} ble hentet.`,
            'success'
        );
    }

    static async getResourceAccess(
        clientOrAdapter: string,
        componentName: string,
        resourceName: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/access/${clientOrAdapter}/component/${componentName}/resource/${resourceName}`,
            functionName: 'getResourceAccess',
        });

        return handleApiResponse<IResource>(
            apiResults,
            `Kunne ikke hente ressurstilgang for: ${resourceName}`,
            `Ressurstilgang for ${resourceName} ble hentet.`,
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
            url: `${API_URL}/access/${clientOrAdapter}/component/${componentName}/resource/${resourceName}/field`,
            functionName: 'getComponentAccess',
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke hente komponenttilgang `,
            `Komponenttilgang ble hentet.`,
            'success'
        );
    }

    static async addAccess(username: string): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'POST',
            url: `${API_URL}/access/${username}`,
            functionName: 'createAdapter',
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke sette opp tilgang',
            'Tilgang ble opprettet'
        );
    }

    static async updateEnvironments(
        username: string,
        environments: string[]
    ): Promise<ApiResponse<any>> {
        // Log the final array for debugging
        logger.silly(`Envs → ${JSON.stringify(environments, null, 2)}`);

        const bodyPayload = { environments };

        const apiResults = await apiManager<any>({
            method: 'PATCH',
            url: `${API_URL}/access/${username}`,
            functionName: 'updateEnvironments',
            body: JSON.stringify(bodyPayload),
        });

        return handleApiResponse(apiResults, 'Kunne ikke endre miljøer', 'Miljøer ble oppdatert');
    }

    static async addComponentAccess(username: string, componentName: string, enabled: string) {
        const apiResults = await apiManager<any>({
            method: 'PATCH',
            url: `${API_URL}/access/${username}/component/${componentName}`,
            functionName: 'addComponentAccess',
            body: JSON.stringify({ enabled }),
        });
        return handleApiResponse(
            apiResults,
            'Kunne ikke oppdatere tilgang',
            'Tilgang ble oppdatert'
        );
    }

    static async updateResource(
        username: string,
        component: string,
        resource: string,
        options: {
            enabled?: boolean;
            isWriteable?: boolean;
            readingOption?: 'SINGULAR' | 'MULTI' | string;
        }
    ) {
        const body: Record<string, any> = {};

        if (options.enabled !== undefined) {
            body.enabled = options.enabled;
        }

        if (options.isWriteable !== undefined) {
            body.isWriteable = options.isWriteable;
        }

        if (options.readingOption !== undefined) {
            body.readingOption = options.readingOption;
        }

        const apiResults = await apiManager<any>({
            method: 'PATCH',
            url: `${API_URL}/access/${username}/component/${component}/resource/${resource}`,
            functionName: 'updateResource',
            body: JSON.stringify(body),
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke oppdatere tilgang',
            'Tilgang ble oppdatert'
        );
    }

    static async addFieldAccess(
        username: string,
        component: string,
        resource: string,
        fields: Array<{
            name: string;
            enabled: boolean;
            mustContain: string;
        }>
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'PATCH',
            url: `${API_URL}/access/${username}/component/${component}/resource/${resource}/field`,
            functionName: 'addFieldAccess',
            body: JSON.stringify(fields),
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke oppdatere felttilganger',
            'Felttilganger ble oppdatert'
        );
    }
}

export default AccessApi;
