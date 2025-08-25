import { NovariApiManager, type ApiResponse } from 'novari-frontend-components';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.API_URL || '';
const roleManager = new NovariApiManager({
    baseUrl: API_URL,
    defaultHeaders: {
        'x-nin': HeaderProperties.getXnin(),
    },
});

export default class RoleApi {
    static async getRoles(): Promise<ApiResponse<any>> {
        return await roleManager.call<any>({
            method: 'GET',
            endpoint: '/api/role',
            functionName: 'getRoles',
            customErrorMessage: 'Kunne ikke hente roller',
            customSuccessMessage: 'Roller hentet vellykket',
        });
    }

    static async addRole(
        orgName: string,
        contactNin: string,
        roleId: string,
        roleName: string
    ): Promise<ApiResponse<any>> {
        return await roleManager.call<any>({
            method: 'PUT',
            endpoint: `/api/organisations/${orgName}/contacts/roles/${contactNin}/${roleId}`,
            functionName: 'addRole',
            customErrorMessage: `Feil ved oppdatering av kontaktrolle: ${roleName}`,
            customSuccessMessage: `Kontaktroller oppdatert: ${roleName}`,
        });
    }

    static async removeRole(
        orgName: string,
        contactNin: string,
        roleId: string,
        roleName: string
    ): Promise<ApiResponse<any>> {
        return await roleManager.call<any>({
            method: 'DELETE',
            endpoint: `/api/organisations/${orgName}/contacts/roles/${contactNin}/${roleId}`,
            functionName: 'removeRole',
            customErrorMessage: `Feil ved fjerning av kontaktrolle: ${roleName}`,
            customSuccessMessage: `Kontaktrolle fjernet: ${roleName}`,
            // customSuccessVariant: 'warning', // uncomment if your manager supports variants
        });
    }
}
