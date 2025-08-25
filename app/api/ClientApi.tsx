import { NovariApiManager, type ApiResponse } from 'novari-frontend-components';
import type { IClient, IPartialClient } from '~/types/Clients';
import logger from '~/utils/logger';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.API_URL || '';
const clientManager = new NovariApiManager({
    baseUrl: API_URL,
    defaultHeaders: {
        'x-nin': HeaderProperties.getXnin(),
    },
});

class ClientApi {
    static async getClients(organisationName: string): Promise<ApiResponse<IClient[]>> {
        return await clientManager.call<IClient[]>({
            method: 'GET',
            endpoint: `/api/clients/${organisationName}`,
            functionName: 'getClients',
            customErrorMessage: `Kunne ikke hente klienter for organisasjonen: ${organisationName}`,
            customSuccessMessage: 'Klienter hentet',
        });
    }

    static async getClientById(
        organisationName: string,
        clientId: string
    ): Promise<IClient | null> {
        const clientsResponse = await this.getClients(organisationName);

        if (!clientsResponse.success) {
            logger.error(`Failed to fetch clients for organisation: ${organisationName}`);
            throw new Error(`Kunne ikke hente klienter for organisasjonen: ${organisationName}`);
        }

        const client = clientsResponse.data?.find((c) => c.name === clientId);
        if (client) return client;

        logger.error(`Client not found, clientId: ${clientId}`);
        throw new Error(`Klient ikke funnet, klientId: ${clientId}`);
    }

    static async createClient(
        client: IPartialClient,
        organisation: string
    ): Promise<ApiResponse<any>> {
        return await clientManager.call<any>({
            method: 'POST',
            endpoint: `/api/clients/${organisation}`,
            functionName: 'createClient',
            body: JSON.stringify(client),
            customErrorMessage: 'Kunne ikke opprette klienten',
            customSuccessMessage: 'Klienten ble opprettet vellykket',
        });
    }

    static async updateClient(
        clientName: string,
        clientShortDescription: string,
        clientNote: string,
        organisation: string
    ): Promise<ApiResponse<any>> {
        const partialClient: IPartialClient = {
            name: clientName,
            shortDescription: clientShortDescription,
            note: clientNote,
        };

        return await clientManager.call<any>({
            method: 'PUT',
            endpoint: `/api/clients/${organisation}/${clientName}`,
            functionName: 'updateClient',
            body: JSON.stringify(partialClient),
            customErrorMessage: 'Kunne ikke oppdatere klienten',
            customSuccessMessage: 'Klienten ble oppdatert vellykket',
        });
    }

    static async deleteClient(clientName: string, organisation: string): Promise<ApiResponse<any>> {
        return await clientManager.call<any>({
            method: 'DELETE',
            endpoint: `/api/clients/${organisation}/${clientName}`,
            functionName: 'deleteClient',
            customErrorMessage: 'Kunne ikke slette klienten',
            customSuccessMessage: 'Klienten ble slettet vellykket',
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
        });
    }

    static async updateComponentInClient(
        componentName: string,
        clientName: string,
        organisationName: string,
        updateType: string
    ): Promise<ApiResponse<any>> {
        const endpoint = `/api/components/organisation/${organisationName}/${componentName}/clients/${clientName}`;
        return updateType === 'true'
            ? this.addComponentToClient(endpoint, componentName)
            : this.removeComponentFromClient(endpoint, componentName);
    }

    private static async addComponentToClient(
        endpoint: string,
        componentName: string
    ): Promise<ApiResponse<any>> {
        return await clientManager.call<any>({
            method: 'PUT',
            endpoint,
            functionName: 'addComponentToClient',
            body: JSON.stringify({ name: componentName }),
            customErrorMessage: `Kunne ikke legge til komponenten: ${componentName}`,
            customSuccessMessage: 'Komponenten ble lagt til',
        });
    }

    private static async removeComponentFromClient(
        endpoint: string,
        componentName: string
    ): Promise<ApiResponse<any>> {
        return await clientManager.call<any>({
            method: 'DELETE',
            endpoint,
            functionName: 'removeComponentFromClient',
            body: JSON.stringify({ name: componentName }),
            customErrorMessage: `Kunne ikke fjerne komponenten: ${componentName}`,
            customSuccessMessage: 'Komponenten ble fjernet',
        });
    }

    static async setPassword(
        adapterName: string,
        password: string,
        organisationName: string
    ): Promise<ApiResponse<any>> {
        return await clientManager.call<any>({
            method: 'PUT',
            endpoint: `/api/clients/${organisationName}/${adapterName}/password`,
            functionName: 'setPassword',
            body: password,
            contentType: 'text/plain',
            customErrorMessage: 'Kunne ikke sette passordet',
            customSuccessMessage: 'Passordet ble satt vellykket',
        });
    }
}

export default ClientApi;
