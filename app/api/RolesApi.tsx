import { error, log } from '~/utils/logger';
import { API_URL } from '~/api/constants';

export default class RoleApi {
    static async getRoles() {
        const url = `${API_URL}/api/role`;
        log('Fetching roles', url);

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
            } else {
                error('Error fetching roles', response.status);
                return null;
            }
        } catch (err) {
            log(err);
            error('Error fetching roles:', err);
            throw new Error('Error fetching roles');
        }
    }

    static async addRole(orgName: string, contactNin: string, roleId: string) {
        const url = `${API_URL}/organisations/${orgName}/contacts/roles/${contactNin}/${roleId}`;
        log('Adding role', url);

        try {
            const response = await fetch(url, {
                method: 'PUT',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                return await response.json();
            } else {
                error('Error adding role', response.status);
                return 'try-error';
            }
        } catch (err) {
            log(err);
            error('Error adding role:', err);
            return 'catch-error';
        }
    }

    static async removeRole(organisationName: string, contactNin: string, roleId: string) {
        const url = `${API_URL}/organisations/${organisationName}/contacts/roles/${contactNin}/${roleId}`;
        log('Removing role', url);

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                return await response.json();
            } else {
                error('Error removing role', response.status);
                return 'try-error';
            }
        } catch (err) {
            log(err);
            error('Error removing role:', err);
            return 'catch-error';
        }
    }
}
