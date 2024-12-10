import { apiManager, handleApiResponse, ApiResponse } from '~/api/ApiManager';
import { IContact } from '~/types/Contact';

const API_URL = process.env.API_URL;

class ContactApi {
    static async getAllContacts(): Promise<ApiResponse<IContact[]>> {
        const apiResults = await apiManager<IContact[]>({
            method: 'GET',
            url: `${API_URL}/api/contacts`,
            functionName: 'getAllContacts',
        });

        return handleApiResponse<IContact[]>(
            apiResults,
            'Kunne ikke hente en liste over kontakter',
            'Kontakter hentet vellykket'
        );
    }

    static async getTechnicalContacts(orgName: string): Promise<ApiResponse<IContact[]>> {
        const apiResults = await apiManager<IContact[]>({
            method: 'GET',
            url: `${API_URL}/api/organisations/${orgName}/contacts/technical`,
            functionName: 'getTechnicalContacts',
        });

        return handleApiResponse<IContact[]>(
            apiResults,
            'Kunne ikke hente en liste over tekniske kontakter',
            'Tekniske kontakter hentet vellykket'
        );
    }

    static async unsetLegalContact(
        contactNin: string,
        orgName: string
    ): Promise<ApiResponse<IContact[]>> {
        const apiResults = await apiManager<IContact[]>({
            method: 'DELETE',
            url: `${API_URL}/api/organisations/${orgName}/contacts/legal/${contactNin}`,
            functionName: 'unsetLegalContact',
        });

        return handleApiResponse<IContact[]>(
            apiResults,
            'Kunne ikke fjerne den juridiske kontakten',
            'Juridisk kontakt fjernet'
        );
    }

    static async setLegalContact(
        contactNin: string,
        organisation: string
    ): Promise<ApiResponse<IContact[]>> {
        await this.unsetLegalContact(contactNin, organisation);

        const apiResults = await apiManager<IContact[]>({
            method: 'PUT',
            url: `${API_URL}/api/organisations/${organisation}/contacts/legal/${contactNin}`,
            functionName: 'setLegalContact',
        });

        console.log(apiResults);
        return handleApiResponse<IContact[]>(
            apiResults,
            'Kunne ikke oppdatere den juridiske kontakten',
            'Juridisk kontakt oppdatert'
        );
    }

    static async addTechnicalContact(
        contactNin: string,
        organisation: string
    ): Promise<ApiResponse<IContact[]>> {
        const apiResults = await apiManager<IContact[]>({
            method: 'PUT',
            url: `${API_URL}/api/organisations/${organisation}/contacts/technical/${contactNin}`,
            functionName: 'addTechnicalContact',
        });

        return handleApiResponse<IContact[]>(
            apiResults,
            'Kunne ikke legge til teknisk kontakt',
            'Teknisk kontakt lagt til'
        );
    }

    static async removeTechnicalContact(
        contactNin: string,
        orgName: string
    ): Promise<ApiResponse<IContact[]>> {
        const apiResults = await apiManager<IContact[]>({
            method: 'DELETE',
            url: `${API_URL}/api/organisations/${orgName}/contacts/technical/${contactNin}`,
            functionName: 'removeTechnicalContact',
        });

        return handleApiResponse<IContact[]>(
            apiResults,
            'Kunne ikke fjerne den tekniske kontakten',
            'Teknisk kontakt fjernet',
            'warning'
        );
    }
}

export default ContactApi;
