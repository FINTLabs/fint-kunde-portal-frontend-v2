import { apiManager, handleApiResponse, ApiResponse } from '~/api/ApiManager';

const API_URL = process.env.API_URL;

class OrganisationApi {
    static async getTechnicalContacts(organisationName: string): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/api/organisations/${organisationName}/contacts/technical`,
            functionName: 'getTechnicalContacts',
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke hente tekniske kontakter for organisasjonen: ${organisationName}`,
            'Tekniske kontakter hentet vellykket'
        );
    }

    static async getLegalContact(organisationName: string): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/api/organisations/${organisationName}/contacts/legal`,
            functionName: 'getLegalContact',
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke hente juridisk kontakt for organisasjonen: ${organisationName}`,
            'Juridisk kontakt hentet vellykket'
        );
    }

    static async updateComponent(
        componentName: string,
        organisationName: string,
        isChecked: boolean
    ): Promise<ApiResponse<any>> {
        const url = `${API_URL}/api/organisations/${organisationName}/components/${componentName}`;

        if (isChecked) {
            return await OrganisationApi.addComponentToOrganisation(url, componentName);
        } else {
            return await OrganisationApi.removeComponentFromOrganisation(url, componentName);
        }
    }

    static async addComponentToOrganisation(
        url: string,
        componentName: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'PUT',
            url,
            functionName: 'addComponentToOrganisation',
            body: JSON.stringify({ name: componentName }),
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke legge til komponenten: ${componentName}`,
            `Komponenten ${componentName} ble lagt til`
        );
    }

    static async removeComponentFromOrganisation(
        url: string,
        componentName: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'DELETE',
            url,
            functionName: 'removeComponentFromOrganisation',
            body: JSON.stringify({ name: componentName }),
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke fjerne komponenten: ${componentName}`,
            `Komponenten ${componentName} ble fjernet`,
            'warning'
        );
    }
}

export default OrganisationApi;
