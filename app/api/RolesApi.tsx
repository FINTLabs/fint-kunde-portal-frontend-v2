import { NovariApiManager, type ApiResponse } from 'novari-frontend-components';

import { IRole } from '~/types';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.API_URL || '';
const roleManager = new NovariApiManager({
    baseUrl: API_URL,
});

export default class RoleApi {
    static async getRoles(): Promise<ApiResponse<IRole[]>> {
        return await roleManager.call<IRole[]>({
            method: 'GET',
            endpoint: '/api/role',
            functionName: 'getRoles',
            customErrorMessage: 'Kunne ikke hente roller',
            customSuccessMessage: 'Roller hentet vellykket',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async addRole(
        orgName: string,
        contactNin: string,
        roleId: string,
        roleName: string
    ): Promise<ApiResponse<IRole>> {
        return await roleManager.call<IRole>({
            method: 'PUT',
            endpoint: `/api/organisations/${orgName}/contacts/roles/${contactNin}/${roleId}`,
            functionName: 'addRole',
            customErrorMessage: `Feil ved oppdatering av kontaktrolle: ${roleName}`,
            customSuccessMessage: `Kontaktroller oppdatert: ${roleName}`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async removeRole(
        orgName: string,
        contactNin: string,
        roleId: string,
        roleName: string
    ): Promise<ApiResponse<IRole>> {
        return await roleManager.call<IRole>({
            method: 'DELETE',
            endpoint: `/api/organisations/${orgName}/contacts/roles/${contactNin}/${roleId}`,
            functionName: 'removeRole',
            customErrorMessage: `Feil ved fjerning av kontaktrolle: ${roleName}`,
            customSuccessMessage: `Kontaktrolle fjernet: ${roleName}`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
            // customSuccessVariant: 'warning', // uncomment if your manager supports variants
        });
    }
}
