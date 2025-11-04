import { NovariApiManager, type ApiResponse } from 'novari-frontend-components';

import { IComponent, IContact } from '~/types';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.API_URL || '';
const orgManager = new NovariApiManager({
    baseUrl: API_URL,
});

class OrganisationApi {
    static async getTechnicalContacts(organisationName: string): Promise<ApiResponse<IContact[]>> {
        return await orgManager.call<IContact[]>({
            method: 'GET',
            endpoint: `/api/organisations/${organisationName}/contacts/technical`,
            functionName: 'getTechnicalContacts',
            customErrorMessage: `Kunne ikke hente tekniske kontakter for organisasjonen: ${organisationName}`,
            customSuccessMessage: 'Tekniske kontakter hentet vellykket',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async getLegalContact(organisationName: string): Promise<ApiResponse<IContact>> {
        return await orgManager.call<IContact>({
            method: 'GET',
            endpoint: `/api/organisations/${organisationName}/contacts/legal`,
            functionName: 'getLegalContact',
            customErrorMessage: `Kunne ikke hente juridisk kontakt for organisasjonen: ${organisationName}`,
            customSuccessMessage: 'Juridisk kontakt hentet vellykket',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async updateComponent(
        componentName: string,
        organisationName: string,
        isChecked: boolean
    ): Promise<ApiResponse<IComponent>> {
        const endpoint = `/api/organisations/${organisationName}/components/${componentName}`;
        return isChecked
            ? this.addComponentToOrganisation(endpoint, componentName)
            : this.removeComponentFromOrganisation(endpoint, componentName);
    }

    private static async addComponentToOrganisation(
        endpoint: string,
        componentName: string
    ): Promise<ApiResponse<IComponent>> {
        return await orgManager.call<IComponent>({
            method: 'PUT',
            endpoint,
            functionName: 'addComponentToOrganisation',
            body: JSON.stringify({ name: componentName }),
            customErrorMessage: `Kunne ikke legge til komponenten: ${componentName}`,
            customSuccessMessage: `Komponenten ${componentName} ble lagt til`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    private static async removeComponentFromOrganisation(
        endpoint: string,
        componentName: string
    ): Promise<ApiResponse<IComponent>> {
        return await orgManager.call<IComponent>({
            method: 'DELETE',
            endpoint,
            functionName: 'removeComponentFromOrganisation',
            body: JSON.stringify({ name: componentName }),
            customErrorMessage: `Kunne ikke fjerne komponenten: ${componentName}`,
            customSuccessMessage: `Komponenten ${componentName} ble fjernet`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }
}

export default OrganisationApi;
