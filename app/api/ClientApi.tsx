import { API_URL } from '~/api/constants';
import { error, log } from '~/utils/logger.js';
import { IClient } from '~/types/Clients';
import { Organisation } from '~/types/Organisation';

class ClientApi {
    static async getClients(organisationName: string) {
        const url = `${API_URL}/api/clients/${organisationName}`;
        log('Fetching clients', url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'x-nin': process.env.PERSONALNUMBER || '',
                },
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (err) {
            error('Error fetching clients:', err);
            throw new Error('Error fetching technical clients');
        }
    }

    static async getClientById(organisationName: string, clientId: string) {
        try {
            const clients: IClient[] = await this.getClients(organisationName);
            log('client search', clientId);
            if (clients) {
                const client = clients.find((client) => client.name === clientId);

                if (client) {
                    return client;
                } else {
                    error('Client not found, clientId:', clientId);
                    return null;
                }
            } else {
                error('No clients found for organisation:', organisationName);
                return null;
            }
        } catch (err) {
            error('Error fetching clients:', err);
            return null;
        }
    }

    static async updateClient(client: IClient, organisation: Organisation) {
        const url = `${API_URL}/api/clients/${organisation}/${client.name}`;
        log('Updating client', url);

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    name: client.name,
                    note: client.note,
                    shortDescription: client.shortDescription,
                }),
            });

            if (response.ok) {
                return await response.json();
            } else {
                error('Error updating client, status:', response.status);
                return null;
            }
        } catch (err) {
            error('Error updating client:', err);
            return null;
        }
    }

    static async createClient(client: IClient, organisation: Organisation) {
        const url = `${API_URL}/api/clients/${organisation}`;
        log('Creating client', url);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: '*/*',
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    name: client.name,
                    note: client.note,
                    shortDescription: client.shortDescription,
                }),
            });

            if (response.ok) {
                return await response.json();
            } else {
                error('Error creating client, status:', response.status);
                return null;
            }
        } catch (err) {
            error('Error creating client:', err);
            return null;
        }
    }

    static async deleteClient(client: IClient, organisation: Organisation) {
        const url = `${API_URL}/api/clients/${organisation}/${client.name}`;
        log('Deleting client', url);

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                credentials: 'same-origin',
            });

            if (response.ok) {
                return await response.json();
            } else {
                error('Error deleting client, status:', response.status);
                return null;
            }
        } catch (err) {
            error('Error deleting client:', err);
            return null;
        }
    }

    // static async addClientToComponent(adapter, component: IComponent, organisation: String) {
    //   const url = `${API_URL}/api/components/organisation/${organisation}/${component.name}/clients/${adapter.name}`;
    //   log('Adding client to component', url);
    //
    //   try {
    //     const response = await fetch(url, {
    //       method: 'PUT',
    //       headers: {
    //         'Accept': '*/*',
    //         'Content-Type': 'application/json',
    //       },
    //       credentials: 'same-origin',
    //       body: JSON.stringify({ name: adapter.name }),
    //     });
    //
    //     if (response.ok) {
    //       return await response.json();
    //     } else {
    //       error('Error adding client to component, status:', response.status);
    //       return null;
    //     }
    //   } catch (err) {
    //     error('Error adding client to component:', err);
    //     return null;
    //   }
    // }

    // static async deleteClientFromComponent(adapter, component, organisation) {
    //   const url = `${API_URL}/api/components/organisation/${organisation}/${component.name}/clients/${adapter.name}`;
    //   log('Deleting client from component', url);
    //
    //   try {
    //     const response = await fetch(url, {
    //       method: 'DELETE',
    //       credentials: 'same-origin',
    //     });
    //
    //     if (response.ok) {
    //       return await response.json();
    //     } else {
    //       error('Error deleting client from component, status:', response.status);
    //       return null;
    //     }
    //   } catch (err) {
    //     error('Error deleting client from component:', err);
    //     return null;
    //   }
    // }
    //
    // static async getOpenIdSecret(adapter, organisation) {
    //   const url = `${API_URL}/api/clients/${organisation}/${adapter.name}/secret`;
    //   log('Fetching OpenID secret', url);
    //
    //   try {
    //     const response = await fetch(url, {
    //       method: 'GET',
    //       credentials: 'same-origin',
    //     });
    //
    //     if (response.ok) {
    //       return await response.text();
    //     } else {
    //       error('Error fetching OpenID secret, status:', response.status);
    //       return null;
    //     }
    //   } catch (err) {
    //     error('Error fetching OpenID secret:', err);
    //     return null;
    //   }
    // }
    //
    // static async setPassword(adapter, password, organisation) {
    //   const url = `${API_URL}/api/clients/${organisation}/${adapter.name}/password`;
    //   log('Setting password', url);
    //
    //   try {
    //     const response = await fetch(url, {
    //       method: 'PUT',
    //       headers: {
    //         'Accept': '*/*',
    //         'Content-Type': 'text/plain',
    //       },
    //       credentials: 'same-origin',
    //       body: password,
    //     });
    //
    //     if (response.ok) {
    //       return await response.json();
    //     } else {
    //       error('Error setting password, status:', response.status);
    //       return null;
    //     }
    //   } catch (err) {
    //     error('Error setting password:', err);
    //     return null;
    //   }
    // }
}

export default ClientApi;
