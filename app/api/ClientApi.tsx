import { request } from '~/api/shared/api';
import { API_URL } from '~/api/constants';
import { IClient, IPartialClient } from '~/types/Clients';

class ClientApi {
    static async getClients(organisationName: string) {
        const functionName = 'getClients';
        const URL = `${API_URL}/api/clients/${organisationName}`;
        return request(URL, functionName, '');
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
        return request(URL, functionName, '', 'POST', 'json', client);
    }

    static async deleteClient(clientName: string, organisation: string) {
        const functionName = 'deleteClient';
        const URL = `${API_URL}/api/clients/${organisation}/${clientName}`;
        return request(URL, functionName, '', 'DELETE');
    }

    // Function to update component in a client
    static async updateComponentInClient(
        componentName: string,
        clientName: string,
        organisationName: string,
        updateType: string
    ) {
        const URL = `${API_URL}/api/components/organisation/${organisationName}/${componentName}/clients/${clientName}`;
        if (updateType === 'add') {
            return await ClientApi.addComponentToClient(URL, componentName);
        } else {
            return await ClientApi.removeComponentFromClient(URL, componentName);
        }
    }

    // Function to add component to a client
    static async addComponentToClient(URL: string, clientName: string) {
        const functionName = 'addComponentToClient';
        return await request(URL, functionName, '', 'PUT', 'json', { name: clientName });
    }

    // Function to remove component from a client
    static async removeComponentFromClient(URL: string, clientName: string) {
        const functionName = 'removeComponentFromClient';
        return await request(URL, functionName, '', 'DELETE', 'json', { name: clientName });
    }

    // static async updateClient(client: IClient, organisation: Organisation) {
    //     const functionName = 'updateClient';
    //     const URL = `${API_URL}/api/clients/${organisation}/${client.name}`;
    //     return request(URL, functionName, '','PUT', 'json', {
    //         name: client.name,
    //         note: client.note,
    //         shortDescription: client.shortDescription
    //     }).catch((err) => {
    //         console.error('Error updating client:', err);
    //         return null;
    //     });
    // }
    //
}

export default ClientApi;
