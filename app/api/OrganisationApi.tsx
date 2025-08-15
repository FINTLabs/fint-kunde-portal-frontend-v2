import { NovariApiManager, type ApiResponse } from 'novari-frontend-components';

const API_URL = process.env.API_URL || '';
const orgManager = new NovariApiManager({ baseUrl: API_URL });

class OrganisationApi {
    static async getTechnicalContacts(organisationName: string): Promise<ApiResponse<any>> {
        return await orgManager.call<any>({
            method: 'GET',
            endpoint: `/api/organisations/${organisationName}/contacts/technical`,
            functionName: 'getTechnicalContacts',
            customErrorMessage: `Kunne ikke hente tekniske kontakter for organisasjonen: ${organisationName}`,
            customSuccessMessage: 'Tekniske kontakter hentet vellykket',
        });
    }

    static async getLegalContact(organisationName: string): Promise<ApiResponse<any>> {
        return await orgManager.call<any>({
            method: 'GET',
            endpoint: `/api/organisations/${organisationName}/contacts/legal`,
            functionName: 'getLegalContact',
            customErrorMessage: `Kunne ikke hente juridisk kontakt for organisasjonen: ${organisationName}`,
            customSuccessMessage: 'Juridisk kontakt hentet vellykket',
        });
    }

    static async updateComponent(
        componentName: string,
        organisationName: string,
        isChecked: boolean
    ): Promise<ApiResponse<any>> {
        const endpoint = `/api/organisations/${organisationName}/components/${componentName}`;
        return isChecked
            ? this.addComponentToOrganisation(endpoint, componentName)
            : this.removeComponentFromOrganisation(endpoint, componentName);
    }

    private static async addComponentToOrganisation(
        endpoint: string,
        componentName: string
    ): Promise<ApiResponse<any>> {
        return await orgManager.call<any>({
            method: 'PUT',
            endpoint,
            functionName: 'addComponentToOrganisation',
            body: JSON.stringify({ name: componentName }),
            customErrorMessage: `Kunne ikke legge til komponenten: ${componentName}`,
            customSuccessMessage: `Komponenten ${componentName} ble lagt til`,
        });
    }

    private static async removeComponentFromOrganisation(
        endpoint: string,
        componentName: string
    ): Promise<ApiResponse<any>> {
        return await orgManager.call<any>({
            method: 'DELETE',
            endpoint,
            functionName: 'removeComponentFromOrganisation',
            body: JSON.stringify({ name: componentName }),
            customErrorMessage: `Kunne ikke fjerne komponenten: ${componentName}`,
            customSuccessMessage: `Komponenten ${componentName} ble fjernet`,
            // customSuccessVariant: 'warning', // uncomment if your manager supports variants
        });
    }
}

export default OrganisationApi;
