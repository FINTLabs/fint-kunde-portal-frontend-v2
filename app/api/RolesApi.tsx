import { request } from '~/api/shared/api';
import { API_URL } from '~/api/constants';
import { error } from '~/utils/logger';

export default class RoleApi {
    static async getRoles() {
        const functionName = 'getRoles';
        const URL = `${API_URL}/api/role`;
        return request(URL, functionName, '').catch((err) => {
            error('Error fetching roles:', err);
            throw new Error('Error fetching roles');
        });
    }

    static async addRole(orgName: string, contactNin: string, roleId: string) {
        const functionName = 'addRole';
        const URL = `${API_URL}/api/organisations/${orgName}/contacts/roles/${contactNin}/${roleId}`;
        return request(URL, functionName, '', 'PUT', 'json').catch((err) => {
            error('Error adding role:', err);
            return 'catch-error';
        });
    }

    static async removeRole(organisationName: string, contactNin: string, roleId: string) {
        const functionName = 'removeRole';
        const URL = `${API_URL}/api/organisations/${organisationName}/contacts/roles/${contactNin}/${roleId}`;

        return request(URL, functionName, '', 'DELETE', 'json').catch((err) => {
            console.error('Error removing role:', err);
            return 'catch-error';
        });
    }
}
