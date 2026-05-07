import { NovariApiManager, type ApiResponse } from 'novari-frontend-components';

import { IClient, IClientModelVersion, IPartialClient } from '~/types/Clients';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.API_URL || '';
const clientManager = new NovariApiManager({
    baseUrl: API_URL,
});

class ClientApi {
    static async getClients(organisationName: string): Promise<ApiResponse<IClient[]>> {
        return await clientManager.call<IClient[]>({
            method: 'GET',
            endpoint: `/api/clients/${organisationName}`,
            functionName: 'getClients',
            customErrorMessage: `Kunne ikke hente klienter for organisasjonen: ${organisationName}`,
            customSuccessMessage: 'Klienter hentet',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async getClientModelVersions(
        organisationName: string
    ): Promise<ApiResponse<IClientModelVersion>> {
        return await clientManager.call<IClientModelVersion>({
            method: 'GET',
            endpoint: `/api/client-metrics/${organisationName}/model-versions`,
            functionName: 'getClientModelVersions',
            customErrorMessage: `Kunne ikke hente modellversjoner for organisasjonen: ${organisationName}`,
            customSuccessMessage: 'Modellversjoner hentet',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async getClientById(
        organisationName: string,
        clientId: string
    ): Promise<IClient | null> {
        const clientsResponse = await this.getClients(organisationName);
        const client = clientsResponse?.data?.find((c) => c.name === clientId);
        return client ?? null;
    }

    static async createClient(
        client: IPartialClient,
        organisation: string
    ): Promise<ApiResponse<IClient>> {
        return await clientManager.call<IClient>({
            method: 'POST',
            endpoint: `/api/clients/${organisation}`,
            functionName: 'createClient',
            body: JSON.stringify(client),
            customErrorMessage: 'Kunne ikke opprette klienten',
            customSuccessMessage: 'Klienten ble opprettet vellykket',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async updateClient(
        clientName: string,
        clientShortDescription: string,
        clientNote: string,
        modelVersion: string,
        organisation: string
    ): Promise<ApiResponse<IClient>> {
        const partialClient: IPartialClient = {
            name: clientName,
            shortDescription: clientShortDescription,
            note: clientNote,
            modelVersion: modelVersion,
        };

        return await clientManager.call<IClient>({
            method: 'PUT',
            endpoint: `/api/clients/${organisation}/${clientName}`,
            functionName: 'updateClient',
            body: JSON.stringify(partialClient),
            customErrorMessage: 'Kunne ikke oppdatere klienten',
            customSuccessMessage: 'Klienten ble oppdatert vellykket',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async deleteClient(
        clientName: string,
        organisation: string
    ): Promise<ApiResponse<IClient>> {
        return await clientManager.call<IClient>({
            method: 'DELETE',
            endpoint: `/api/clients/${organisation}/${clientName}`,
            functionName: 'deleteClient',
            customErrorMessage: 'Kunne ikke slette klienten',
            customSuccessMessage: 'Klienten ble slettet vellykket',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
            // customSuccessVariant: 'warning', // uncomment if your manager supports variants
        });
    }

    static async getOpenIdSecret(
        clientName: string,
        organisationName: string
    ): Promise<ApiResponse<string>> {
        return await clientManager.call<string>({
            method: 'GET',
            endpoint: `/api/clients/${organisationName}/${clientName}/secret`,
            functionName: 'getOpenIdSecret',
            customErrorMessage: 'Kunne ikke hente OpenID Secret',
            customSuccessMessage: 'Klienthemmeligheten ble hentet',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async updateComponentInClient(
        componentName: string,
        clientName: string,
        organisationName: string,
        updateType: string
    ): Promise<ApiResponse<IClient>> {
        const endpoint = `/api/components/organisation/${organisationName}/${componentName}/clients/${clientName}`;
        return updateType === 'true'
            ? this.addComponentToClient(endpoint, componentName)
            : this.removeComponentFromClient(endpoint, componentName);
    }

    private static async addComponentToClient(
        endpoint: string,
        componentName: string
    ): Promise<ApiResponse<IClient>> {
        return await clientManager.call<IClient>({
            method: 'PUT',
            endpoint,
            functionName: 'addComponentToClient',
            body: JSON.stringify({ name: componentName }),
            customErrorMessage: `Kunne ikke legge til komponenten: ${componentName}`,
            customSuccessMessage: 'Komponenten ble lagt til',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    private static async removeComponentFromClient(
        endpoint: string,
        componentName: string
    ): Promise<ApiResponse<IClient>> {
        return await clientManager.call<IClient>({
            method: 'DELETE',
            endpoint,
            functionName: 'removeComponentFromClient',
            body: JSON.stringify({ name: componentName }),
            customErrorMessage: `Kunne ikke fjerne komponenten: ${componentName}`,
            customSuccessMessage: 'Komponenten ble fjernet',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async setPassword(
        adapterName: string,
        password: string,
        organisationName: string
    ): Promise<ApiResponse<IClient>> {
        return await clientManager.call<IClient>({
            method: 'PUT',
            endpoint: `/api/clients/${organisationName}/${adapterName}/password`,
            functionName: 'setPassword',
            body: password,
            contentType: 'text/plain',
            customErrorMessage: 'Kunne ikke sette passordet',
            customSuccessMessage: 'Passordet ble satt vellykket',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }
}

export default ClientApi;
