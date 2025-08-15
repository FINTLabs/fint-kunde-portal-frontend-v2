import logger from '~/utils/logger';
import type { ApiResponse } from 'novari-frontend-components';
import { NovariApiManager } from 'novari-frontend-components';
import type { IResource } from '~/types/Access';

const ACCESS_URL = process.env.ACCESS_URL || '';
const accessManager = new NovariApiManager({ baseUrl: ACCESS_URL });

class AccessApi {
    static async getClientorAdapterAccess(name: string): Promise<ApiResponse<any>> {
        return await accessManager.call<any>({
            method: 'GET',
            endpoint: `/access/${name}`,
            functionName: 'getClientorAdapterAccess',
            customErrorMessage: `Kunne ikke hente tilgang for: ${name}`,
            customSuccessMessage: `Tilgang for ${name} ble hentet.`,
        });
    }

    static async getClientorAdapterAccessComponents(name: string): Promise<ApiResponse<any>> {
        return await accessManager.call<any>({
            method: 'GET',
            endpoint: `/access/${name}/component`,
            functionName: 'getClientorAdapterAccessComponents',
            customErrorMessage: `Kunne ikke hente tilgang for: ${name}`,
            customSuccessMessage: `Tilgang for ${name} ble hentet.`,
        });
    }

    static async getComponentAccess(
        name: string,
        clientOrAdapter: string
    ): Promise<ApiResponse<any>> {
        return await accessManager.call<any>({
            method: 'GET',
            endpoint: `/access/${clientOrAdapter}/component/${name}/resource`,
            functionName: 'getComponentAccess',
            customErrorMessage: `Kunne ikke hente komponenttilgang for: ${name}`,
            customSuccessMessage: `Komponenttilgang for ${name} ble hentet.`,
        });
    }

    static async getResourceAccess(
        clientOrAdapter: string,
        componentName: string,
        resourceName: string
    ): Promise<ApiResponse<IResource>> {
        return await accessManager.call<IResource>({
            method: 'GET',
            endpoint: `/access/${clientOrAdapter}/component/${componentName}/resource/${resourceName}`,
            functionName: 'getResourceAccess',
            customErrorMessage: `Kunne ikke hente ressurstilgang for: ${resourceName}`,
            customSuccessMessage: `Ressurstilgang for ${resourceName} ble hentet.`,
        });
    }

    static async getFieldAccess(
        clientOrAdapter: string,
        componentName: string,
        resourceName: string
    ): Promise<ApiResponse<any>> {
        return await accessManager.call<any>({
            method: 'GET',
            endpoint: `/access/${clientOrAdapter}/component/${componentName}/resource/${resourceName}/field`,
            functionName: 'getFieldAccess',
            customErrorMessage: `Kunne ikke hente komponenttilgang`,
            customSuccessMessage: `Komponenttilgang ble hentet.`,
        });
    }

    static async addAccess(username: string): Promise<ApiResponse<any>> {
        return await accessManager.call<any>({
            method: 'POST',
            endpoint: `/access/${username}`,
            functionName: 'addAccess',
            customErrorMessage: 'Kunne ikke sette opp tilgang',
            customSuccessMessage: 'Tilgang ble opprettet',
        });
    }

    static async deleteAccess(username: string): Promise<ApiResponse<any>> {
        return await accessManager.call<any>({
            method: 'DELETE',
            endpoint: `/access/${username}`,
            functionName: 'deleteAccess',
            customErrorMessage: 'Kunne ikke slette tilgang',
            customSuccessMessage: 'Tilgang ble slettet',
        });
    }

    static async updateEnvironments(
        username: string,
        environments: string[]
    ): Promise<ApiResponse<any>> {
        logger.silly(`Envs → ${JSON.stringify(environments, null, 2)}`);

        return await accessManager.call<any>({
            method: 'PATCH',
            endpoint: `/access/${username}`,
            functionName: 'updateEnvironments',
            body: JSON.stringify({ environments }),
            customErrorMessage: 'Kunne ikke endre miljøer',
            customSuccessMessage: 'Miljøer ble oppdatert',
        });
    }

    static async addComponentAccess(
        username: string,
        componentName: string,
        enabled: string
    ): Promise<ApiResponse<any>> {
        return await accessManager.call<any>({
            method: 'PATCH',
            endpoint: `/access/${username}/component/${componentName}`,
            functionName: 'addComponentAccess',
            body: JSON.stringify({ enabled }),
            customErrorMessage: 'Kunne ikke oppdatere tilgang',
            customSuccessMessage: 'Tilgang ble oppdatert',
        });
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
    ): Promise<ApiResponse<any>> {
        const body: Record<string, any> = {};
        if (options.enabled !== undefined) body.enabled = options.enabled;
        if (options.isWriteable !== undefined) body.isWriteable = options.isWriteable;
        if (options.readingOption !== undefined) body.readingOption = options.readingOption;

        return await accessManager.call<any>({
            method: 'PATCH',
            endpoint: `/access/${username}/component/${component}/resource/${resource}`,
            functionName: 'updateResource',
            body: JSON.stringify(body),
            customErrorMessage: 'Kunne ikke oppdatere tilgang',
            customSuccessMessage: 'Tilgang ble oppdatert',
        });
    }

    static async updateFieldAccess(
        username: string,
        component: string,
        resource: string,
        field: string,
        enabled: string
    ): Promise<ApiResponse<any>> {
        return await accessManager.call<any>({
            method: 'PATCH',
            endpoint: `/access/${username}/component/${component}/resource/${resource}/field/${field}`,
            functionName: 'updateFieldAccess',
            body: JSON.stringify({ enabled }),
            customErrorMessage: 'Kunne ikke oppdatere tilgang',
            customSuccessMessage: 'Tilgang ble oppdatert',
        });
    }

    static async addFieldAccess(
        username: string,
        component: string,
        resource: string,
        fields: Array<{ name: string; enabled: boolean; mustContain: string }>
    ): Promise<ApiResponse<any>> {
        return await accessManager.call<any>({
            method: 'PATCH',
            endpoint: `/access/${username}/component/${component}/resource/${resource}/field`,
            functionName: 'addFieldAccess',
            body: JSON.stringify(fields),
            customErrorMessage: 'Kunne ikke oppdatere felttilganger',
            customSuccessMessage: 'Felttilganger ble oppdatert',
        });
    }
}

export default AccessApi;
