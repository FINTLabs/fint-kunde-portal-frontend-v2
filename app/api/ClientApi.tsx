import { request } from '~/api/shared/api';
import { API_URL } from '~/api/constants';
import { IClient, IPartialClient } from '~/types/Clients';
import { HeaderProperties } from '~/utils/headerProperties';

class ClientApi {
    static async getClients(organisationName: string) {
        const functionName = 'getClients';
        const URL = `${API_URL}/api/clients/${organisationName}`;
        return request(URL, functionName);
    }

    static async getClientById(organisationName: string, clientId: string) {
        return this.getClients(organisationName)
            .then((clients: IClient[]) => {
                const client = clients.find((client) => client.name === clientId);
                if (client) {
                    return client;
                } else {
                    console.error('Client not found, clientId:', clientId);
                    return null;
                }
            })
            .catch((err) => {
                console.error('Error fetching client:', err);
                return null;
            });
    }
    static async createClient(client: IPartialClient, organisation: string) {
        const functionName = 'createClient';
        const URL = `${API_URL}/api/clients/${organisation}`;
        return request(URL, functionName, 'POST', 'json', client);
    }

    static updateClient(
        clientName: string,
        clientShortDescription: string,
        clientNote: string,
        organisation: string
    ) {
        const partialClient: IPartialClient = {
            name: clientName, // Assuming this is the current client name
            shortDescription: clientShortDescription,
            note: clientNote,
        };

        const functionName = 'updateClient';
        const URL = `${API_URL}/api/clients/${organisation}/${clientName}`;
        console.debug('adding:', URL, partialClient);
        return request(URL, functionName, 'PUT', 'json', partialClient);
    }

    static async deleteClient(clientName: string, organisation: string) {
        const functionName = 'deleteClient';
        const URL = `${API_URL}/api/clients/${organisation}/${clientName}`;
        return request(URL, functionName, 'DELETE');
    }

    static async getOpenIdSecret(clientName: string, organisationName: string): Promise<string> {
        const functionName = 'getOpenIdSecret';
        const URL = `${API_URL}/api/clients/${organisationName}/${clientName}/secret`;

        return request(URL, functionName, 'GET', 'text');
    }

    static async updateComponentInClient(
        componentName: string,
        clientName: string,
        organisationName: string,
        updateType: string
    ) {
        console.log('------------------ update', updateType);
        const URL = `${API_URL}/api/components/organisation/${organisationName}/${componentName}/clients/${clientName}`;
        if (updateType === 'true') {
            return await ClientApi.addComponentToClient(URL, componentName);
        } else {
            return await ClientApi.removeComponentFromClient(URL, componentName);
        }
    }

    static async addComponentToClient(URL: string, clientName: string) {
        const functionName = 'addComponentToClient';
        return await request(URL, functionName, 'PUT', 'json', { name: clientName });
    }

    static async removeComponentFromClient(URL: string, clientName: string) {
        const functionName = 'removeComponentFromClient';
        return await request(URL, functionName, 'DELETE', 'json', { name: clientName });
    }

    static async setPassword(adapterName: string, password: string, organisationName: string) {
        console.log('Create new password client: ', adapterName, password);
        const request = new Request(
            `${API_URL}/api/clients/${organisationName}/${adapterName}/password`,
            {
                method: 'PUT',
                headers: {
                    Accept: '*/*',
                    'Content-Type': 'text/plain',
                    'x-nin': HeaderProperties.getXnin(),
                },
                credentials: 'same-origin',
                body: password,
            }
        );
        return fetch(request)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                return error;
            });
    }
}

export default ClientApi;
