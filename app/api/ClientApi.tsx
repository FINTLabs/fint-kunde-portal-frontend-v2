import { request } from '~/api/shared/api';
import { API_URL } from '~/api/constants';
import { IClient } from '~/types/Clients';

class ClientApi {
    static async getClients(organisationName: string) {
        const functionName = 'getClients';
        const URL = `${API_URL}/api/clients/${organisationName}`;
        return request(URL, functionName).catch((err) => {
            console.error('Error fetching clients:', err);
            throw new Error('Error fetching clients');
        });
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

    // static async updateClient(client: IClient, organisation: Organisation) {
    //     const functionName = 'updateClient';
    //     const URL = `${API_URL}/api/clients/${organisation}/${client.name}`;
    //     return request(URL, functionName, 'PUT', 'json', {
    //         name: client.name,
    //         note: client.note,
    //         shortDescription: client.shortDescription
    //     }).catch((err) => {
    //         console.error('Error updating client:', err);
    //         return null;
    //     });
    // }
    //
    // static async createClient(client: IClient, organisation: Organisation) {
    //     const functionName = 'createClient';
    //     const URL = `${API_URL}/api/clients/${organisation}`;
    //     return request(URL, functionName, 'POST', 'json', {
    //         name: client.name,
    //         note: client.note,
    //         shortDescription: client.shortDescription
    //     }).catch((err) => {
    //         console.error('Error creating client:', err);
    //         return null;
    //     });
    // }

    // static async deleteClient(client: IClient, organisation: Organisation) {
    //     const functionName = 'deleteClient';
    //     const URL = `${API_URL}/api/clients/${organisation}/${client.name}`;
    //     return request(URL, functionName, 'DELETE').catch((err) => {
    //         console.error('Error deleting client:', err);
    //         return null;
    //     });
    // }
}

export default ClientApi;
