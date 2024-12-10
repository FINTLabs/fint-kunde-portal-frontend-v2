import { apiManager, handleApiResponse, ApiResponse } from '~/api/ApiManager';

const API_URL = process.env.API_URL;

export default class RoleApi {
    static async getRoles(): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/api/role`,
            functionName: 'getRoles',
        });

        return handleApiResponse(apiResults, 'Kunne ikke hente roller', 'Roller hentet vellykket');
    }

    static async addRole(
        orgName: string,
        contactNin: string,
        roleId: string,
        roleName: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'PUT',
            url: `${API_URL}/api/organisations/${orgName}/contacts/roles/${contactNin}/${roleId}`,
            functionName: 'addRole',
        });

        return handleApiResponse(
            apiResults,
            `Feil ved oppdatering av kontaktrolle: ${roleName}`,
            `Kontaktroller oppdatert: ${roleName}`
        );
    }

    static async removeRole(
        orgName: string,
        contactNin: string,
        roleId: string,
        roleName: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'DELETE',
            url: `${API_URL}/api/organisations/${orgName}/contacts/roles/${contactNin}/${roleId}`,
            functionName: 'removeRole',
        });

        return handleApiResponse(
            apiResults,
            `Feil ved fjerning av kontaktrolle: ${roleName}`,
            `Kontaktrolle fjernet: ${roleName}`,
            'warning'
        );
    }
}
