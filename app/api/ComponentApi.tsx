import { apiManager, handleApiResponse, ApiResponse } from '~/api/ApiManager';
import { IClient } from '~/types/Clients';

const API_URL = process.env.API_URL;

class ComponentApi {
    static async getAllComponents(): Promise<ApiResponse<IClient[]>> {
        const apiResults = await apiManager<IClient[]>({
            method: 'GET',
            url: `${API_URL}/api/components`,
            functionName: 'getAllComponents',
        });

        return handleApiResponse(apiResults, 'Kunne ikke hente alle komponenter.');
    }

    static async getComponentById(componentName: string): Promise<IClient | null> {
        const componentsResponse = await this.getAllComponents();

        if (!componentsResponse.success) {
            throw new Response('Kunne ikke hente komponenter.');
        }

        const component = componentsResponse.data?.find((item) => item.name === componentName);
        if (component) {
            return component;
        } else {
            throw new Response(`Komponent med navn ${componentName} ikke funnet.`);
        }
    }

    static async getOrganisationComponents(
        organisationName: string
    ): Promise<ApiResponse<IClient[]>> {
        const apiResults = await apiManager<IClient[]>({
            method: 'GET',
            url: `${API_URL}/api/components/organisation/${organisationName}`,
            functionName: 'getOrganisationComponents',
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke hente komponenter for organisasjonen: ${organisationName}.`,
            `Komponenter for organisasjonen ${organisationName} ble hentet.`,
            'success'
        );
    }
}

export default ComponentApi;
