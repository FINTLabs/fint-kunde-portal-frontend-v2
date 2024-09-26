import { request } from '~/api/shared/api';
import { API_URL } from '~/api/constants';

export default class RoleApi {
    static async getRoles() {
        const functionName = 'getRoles';
        const URL = `${API_URL}/api/role`;
        return request(URL, functionName).catch((err) => {
            console.error('Error fetching roles:', err);
            throw new Error('Error fetching roles');
        });
    }

    static async addRole(orgName: string, contactNin: string, roleId: string) {
        const functionName = 'addRole';
        const URL = `${API_URL}/api/organisations/${orgName}/contacts/roles/${contactNin}/${roleId}`;

        return request(URL, functionName, 'PUT', 'json');
        // if (response.status == 202)
        //     return { message: `Kontaktroller oppdatert: ${roleId}`, variant: 'success' };
        // else return { message: `Error oppdatering av kontaktrolle: ${roleId}`, variant: 'error' };
    }

    static async removeRole(organisationName: string, contactNin: string, roleId: string) {
        const functionName = 'removeRole';
        const URL = `${API_URL}/api/organisations/${organisationName}/contacts/roles/${contactNin}/${roleId}`;

        return request(URL, functionName, 'DELETE', 'json');
    }
}
