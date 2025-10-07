import { ApiResponse, NovariApiManager } from 'novari-frontend-components';

import { IContact } from '~/types/Contact';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.API_URL || '';
const apiManager = new NovariApiManager({
    baseUrl: API_URL,
});

class ContactApi {
    static async getAllContacts(): Promise<ApiResponse<IContact[]>> {
        return await apiManager.call<IContact[]>({
            method: 'GET',
            endpoint: '/api/contacts',
            functionName: 'getAllContacts',
            customErrorMessage: 'Kunne ikke hente en liste over kontakter',
            customSuccessMessage: 'Kontakter hentet vellykket',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async getTechnicalContacts(orgName: string): Promise<ApiResponse<IContact[]>> {
        return await apiManager.call<IContact[]>({
            method: 'GET',
            endpoint: `/api/organisations/${orgName}/contacts/technical`,
            functionName: 'getTechnicalContacts',
            customErrorMessage: 'Kunne ikke hente en liste over tekniske kontakter',
            customSuccessMessage: 'Tekniske kontakter hentet vellykket',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async unsetLegalContact(
        contactNin: string,
        orgName: string
    ): Promise<ApiResponse<IContact[]>> {
        return await apiManager.call<IContact[]>({
            method: 'DELETE',
            endpoint: `/api/organisations/${orgName}/contacts/legal/${contactNin}`,
            functionName: 'unsetLegalContact',
            customErrorMessage: 'Kunne ikke fjerne den juridiske kontakten',
            customSuccessMessage: 'Juridisk kontakt fjernet',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
            // customSuccessVariant: 'warning', // <- use this if your apiManager supports variants
        });
    }

    static async setLegalContact(
        contactNin: string,
        organisation: string
    ): Promise<ApiResponse<IContact[]>> {
        // keep your existing flow: ensure only one legal contact
        await this.unsetLegalContact(contactNin, organisation);

        return await apiManager.call<IContact[]>({
            method: 'PUT',
            endpoint: `/api/organisations/${organisation}/contacts/legal/${contactNin}`,
            functionName: 'setLegalContact',
            customErrorMessage: 'Kunne ikke oppdatere den juridiske kontakten',
            customSuccessMessage: 'Juridisk kontakt oppdatert',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async addTechnicalContact(
        contactNin: string,
        organisation: string
    ): Promise<ApiResponse<IContact[]>> {
        return await apiManager.call<IContact[]>({
            method: 'PUT',
            endpoint: `/api/organisations/${organisation}/contacts/technical/${contactNin}`,
            functionName: 'addTechnicalContact',
            customErrorMessage: 'Kunne ikke legge til teknisk kontakt',
            customSuccessMessage: 'Teknisk kontakt lagt til',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async removeTechnicalContact(
        contactNin: string,
        orgName: string
    ): Promise<ApiResponse<IContact[]>> {
        return await apiManager.call<IContact[]>({
            method: 'DELETE',
            endpoint: `/api/organisations/${orgName}/contacts/technical/${contactNin}`,
            functionName: 'removeTechnicalContact',
            customErrorMessage: 'Kunne ikke fjerne den tekniske kontakten',
            customSuccessMessage: 'Teknisk kontakt fjernet',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
            customSuccessVariant: 'warning',
        });
    }
}

export default ContactApi;
