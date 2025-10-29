import log4js from 'log4js';
import { type ApiResponse, NovariApiManager } from 'novari-frontend-components';

import { IAccess, IComponentAccess, IDomainPackages, IField, IResource } from '~/types/Access';
import { HeaderProperties } from '~/utils/headerProperties';

const logger = log4js.getLogger();

const ACCESS_URL = process.env.ACCESS_URL || '';

const accessManager = new NovariApiManager({ baseUrl: ACCESS_URL });

class AccessApi {
    //***** /access/{username}
    static async getClientOrAdapterAccess(name: string): Promise<ApiResponse<IAccess>> {
        logger.debug(`Fetching access for: ${name}`);
        return await accessManager.call<IAccess>({
            method: 'GET',
            endpoint: `/access/${name}`,
            functionName: 'getClientOrAdapterAccess',
            customErrorMessage: `Kunne ikke hente tilgang for: ${name}`,
            customSuccessMessage: `Tilgang for ${name} ble hentet`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    // ***** /access/{username}/component
    static async getClientOrAdapterAccessComponents(
        name: string
    ): Promise<ApiResponse<IDomainPackages>> {
        return await accessManager.call<IDomainPackages>({
            method: 'GET',
            endpoint: `/access/${name}/component`,
            functionName: 'getClientorAdapterAccessComponents',
            customErrorMessage: `Kunne ikke hente tilgang for: ${name}`,
            customSuccessMessage: `Tilgang for ${name} ble hentet.`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    // ***** /access/{username}/component/{component}/resource
    static async getComponentAccess(
        name: string,
        clientOrAdapter: string
    ): Promise<ApiResponse<IResource>> {
        return await accessManager.call<IResource>({
            method: 'GET',
            endpoint: `/access/${clientOrAdapter}/component/${name}/resource`,
            functionName: 'getComponentAccess',
            customErrorMessage: `Kunne ikke hente komponenttilgang for: ${name}`,
            customSuccessMessage: `Komponenttilgang for ${name} ble hentet.`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    //***** /access/{username}/component/{component}/resource/{resource}
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
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    // ***** /access/{username}/component/{component}/resource/{resource}/field
    static async getFieldAccess(
        clientOrAdapter: string,
        componentName: string,
        resourceName: string
    ): Promise<ApiResponse<IField>> {
        return await accessManager.call<IField>({
            method: 'GET',
            endpoint: `/access/${clientOrAdapter}/component/${componentName}/resource/${resourceName}/field`,
            functionName: 'getFieldAccess',
            customErrorMessage: `Kunne ikke hente komponenttilgang`,
            customSuccessMessage: `Komponenttilgang ble hentet: ${componentName}`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async addAccess(username: string): Promise<ApiResponse<IAccess>> {
        logger.info(`Creating access for user: ${username}`);
        return await accessManager.call<IAccess>({
            method: 'POST',
            endpoint: `/access/${username}`,
            functionName: 'addAccess',
            customErrorMessage: 'Kunne ikke sette opp tilgang',
            customSuccessMessage: `Tilgang ble opprettet: ${username}`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async deleteAccess(username: string): Promise<ApiResponse<IAccess>> {
        logger.warn(`Deleting access for user: ${username}`);
        return await accessManager.call<IAccess>({
            method: 'DELETE',
            endpoint: `/access/${username}`,
            functionName: 'deleteAccess',
            customErrorMessage: 'Kunne ikke slette tilgang',
            customSuccessMessage: `Tilgang ble slettet: ${username}`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async updateEnvironments(
        username: string,
        environments: string[]
    ): Promise<ApiResponse<IAccess>> {
        logger.info(`Updating environments for user: ${username}`, { environments });
        return await accessManager.call<IAccess>({
            method: 'PATCH',
            endpoint: `/access/${username}`,
            functionName: 'updateEnvironments',
            body: JSON.stringify({ environments }),
            customErrorMessage: 'Kunne ikke endre miljøer',
            customSuccessMessage: `Miljøer ble oppdatert: ${environments.length} miljøer`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async addComponentAccess(
        username: string,
        componentName: string,
        enabled: string
    ): Promise<ApiResponse<IComponentAccess>> {
        const response = await accessManager.call<IComponentAccess>({
            method: 'PATCH',
            endpoint: `/access/${username}/component/${componentName}`,
            functionName: 'addComponentAccess',
            body: JSON.stringify({ enabled }),
            customErrorMessage: 'Kunne ikke oppdatere tilgang',
            customSuccessMessage:
                enabled === 'true'
                    ? `Tilgang ble lagt til`
                    : `Tilgang ble fjernet til alle ressurser`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
        response.body.componentName = componentName;
        return response;
    }

    static async updateResources(
        username: string,
        component: string,
        resources: Array<{
            component: string;
            resource: string;
            enabled: boolean;
            writeable: boolean;
            readingOption: string | null;
        }>
    ): Promise<ApiResponse<IResource>> {
        return await accessManager.call<IResource>({
            method: 'PATCH',
            endpoint: `/access/${username}/component/${component}/resource`,
            functionName: 'updateResources',
            body: JSON.stringify(resources),
            customErrorMessage: 'Kunne ikke oppdatere tilgang',
            customSuccessMessage:
                resources.length === 1
                    ? `Tilgang ble oppdatert`
                    : `Tilgang ble oppdatert alle`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async updateFieldAccess(
        username: string,
        component: string,
        resource: string,
        field: string,
        enabled: string
    ): Promise<ApiResponse<IField>> {
        return await accessManager.call<IField>({
            method: 'PATCH',
            endpoint: `/access/${username}/component/${component}/resource/${resource}/field/${field}`,
            functionName: 'updateFieldAccess',
            body: JSON.stringify({ enabled }),
            customErrorMessage: 'Kunne ikke oppdatere tilgang',
            customSuccessMessage: `Tilgang ble oppdatert: ${field} felt`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async addFieldAccess(
        username: string,
        component: string,
        resource: string,
        fields: Array<{ name: string; enabled: boolean; mustContain: string }>
    ): Promise<ApiResponse<IField>> {
        return await accessManager.call<IField>({
            method: 'PATCH',
            endpoint: `/access/${username}/component/${component}/resource/${resource}/field`,
            functionName: 'addFieldAccess',
            body: JSON.stringify(fields),
            customErrorMessage: 'Kunne ikke oppdatere felttilganger',
            customSuccessMessage: `Felttilganger ble oppdatert: ${fields.length} felter`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }
}

export default AccessApi;
