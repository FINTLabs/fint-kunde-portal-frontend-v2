import { error, log } from '~/utils/logger';
import {API_URL} from "~/api/constants";

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

            if (response.redirected) {
                log('Roles request was redirected:', response.url);
            }

            if (response.ok) {
                return await response.json();
            } else {
                error('Error fetching roles', response.status);
                return 'try-error';
            }
        } catch (err) {
            log(err);
            error('Error fetching roles:', err);
            return 'catch-error';
        }
    }

    // static async addRole(organisationName, nin, roles) {
    //     const url = `${API_URL}/organisations/${organisationName}/contacts/roles/${nin}/${roles}`;
    //     log('Adding role', url);
    //
    //     try {
    //         const response = await fetch(url, {
    //             method: 'PUT',
    //             credentials: 'same-origin',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //
    //         if (response.redirected) {
    //             log('Add role request was redirected:', response.url);
    //         }
    //
    //         if (response.ok) {
    //             return await response.json();
    //         } else {
    //             error('Error adding role', response.status);
    //             return 'try-error';
    //         }
    //     } catch (err) {
    //         log(err);
    //         error('Error adding role:', err);
    //         return 'catch-error';
    //     }
    // }
    //
    // static async removeRole(organisationName, nin, roles) {
    //     const url = `${API_URL}/organisations/${organisationName}/contacts/roles/${nin}/${roles}`;
    //     log('Removing role', url);
    //
    //     try {
    //         const response = await fetch(url, {
    //             method: 'DELETE',
    //             credentials: 'same-origin',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //
    //         if (response.redirected) {
    //             log('Remove role request was redirected:', response.url);
    //         }
    //
    //         if (response.ok) {
    //             return await response.json();
    //         } else {
    //             error('Error removing role', response.status);
    //             return 'try-error';
    //         }
    //     } catch (err) {
    //         log(err);
    //         error('Error removing role:', err);
    //         return 'catch-error';
    //     }
    // }
}
