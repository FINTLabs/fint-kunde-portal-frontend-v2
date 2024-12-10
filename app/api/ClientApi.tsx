import { apiManager, ApiResponse, handleApiResponse } from '~/api/ApiManager';
import { IClient, IPartialClient } from '~/types/Clients';
import logger from '~/utils/logger';

const API_URL = process.env.API_URL;

class ClientApi {
    static async getClients(organisationName: string): Promise<ApiResponse<IClient[]>> {
        const apiResults = await apiManager<IClient[]>({
            method: 'GET',
            url: `${API_URL}/api/clients/${organisationName}`,
            functionName: 'getClients',
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke hente klienter for organisasjonen: ${organisationName}`
        );
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

        const client = clientsResponse.data?.find((client) => client.name === clientId);
        if (client) {
            return client;
        } else {
            logger.error(`Client not found, clientId: ${clientId}`);
            throw new Error(`Klient ikke funnet, klientId: ${clientId}`);
        }
    }

    static async createClient(
        client: IPartialClient,
        organisation: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'POST',
            url: `${API_URL}/api/clients/${organisation}`,
            functionName: 'createClient',
            body: JSON.stringify(client),
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke opprette klienten',
            'Klienten ble opprettet vellykket'
        );
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

        const apiResults = await apiManager<any>({
            method: 'PUT',
            url: `${API_URL}/api/clients/${organisation}/${clientName}`,
            functionName: 'updateClient',
            body: JSON.stringify(partialClient),
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke oppdatere klienten',
            'Klienten ble oppdatert vellykket'
        );
    }

    static async deleteClient(clientName: string, organisation: string): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'DELETE',
            url: `${API_URL}/api/clients/${organisation}/${clientName}`,
            functionName: 'deleteClient',
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke slette klienten',
            'Klienten ble slettet vellykket',
            'warning'
        );
    }

    static async getOpenIdSecret(
        clientName: string,
        organisationName: string
    ): Promise<ApiResponse<string>> {
        const apiResults = await apiManager<string>({
            method: 'GET',
            url: `${API_URL}/api/clients/${organisationName}/${clientName}/secret`,
            functionName: 'getOpenIdSecret',
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke hente OpenID Secret',
            'Klienthemmeligheten ble hentet'
        );
    }

    static async updateComponentInClient(
        componentName: string,
        clientName: string,
        organisationName: string,
        updateType: string
    ): Promise<ApiResponse<any>> {
        const url = `${API_URL}/api/components/organisation/${organisationName}/${componentName}/clients/${clientName}`;

        if (updateType === 'true') {
            return await this.addComponentToClient(url, componentName);
        } else {
            return await this.removeComponentFromClient(url, componentName);
        }
    }

    static async addComponentToClient(url: string, clientName: string): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'PUT',
            url,
            functionName: 'addComponentToClient',
            body: JSON.stringify({ name: clientName }),
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke legge til komponenten: ${clientName}`,
            'Komponenten ble lagt til'
        );
    }

    static async removeComponentFromClient(
        url: string,
        clientName: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'DELETE',
            url,
            functionName: 'removeComponentFromClient',
            body: JSON.stringify({ name: clientName }),
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke fjerne komponenten: ${clientName}`,
            'Komponenten ble fjernet'
        );
    }

    static async setPassword(
        adapterName: string,
        password: string,
        organisationName: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'PUT',
            url: `${API_URL}/api/clients/${organisationName}/${adapterName}/password`,
            functionName: 'setPassword',
            body: password,
            contentType: 'text/plain',
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke sette passordet',
            'Passordet ble satt vellykket'
        );
    }
}

export default ClientApi;
