import { type ApiResponse, NovariApiManager } from 'novari-frontend-components';

import { IComponent } from '~/types';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.API_URL || '';
const componentManager = new NovariApiManager({
    baseUrl: API_URL,
});

class ComponentApi {
    static async getAllComponents(): Promise<ApiResponse<IComponent[]>> {
        return await componentManager.call<IComponent[]>({
            method: 'GET',
            endpoint: '/api/components',
            functionName: 'getAllComponents',
            customErrorMessage: 'Kunne ikke hente alle komponenter.',
            customSuccessMessage: 'Komponenter hentet.',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async getComponentById(componentName: string): Promise<IComponent | null> {
        const componentsResponse = await this.getAllComponents();

        if (!componentsResponse.success) {
            throw new Response('Kunne ikke hente komponenter.');
        }

        const component = componentsResponse.data?.find((item) => item.name === componentName);
        if (component) {
            return component;
        }
        throw new Response(`Komponent med navn ${componentName} ikke funnet.`);
    }

    static async getOrganisationComponents(
        organisationName: string
    ): Promise<ApiResponse<IComponent[]>> {
        return await componentManager.call<IComponent[]>({
            method: 'GET',
            endpoint: `/api/components/organisation/${organisationName}`,
            functionName: 'getOrganisationComponents',
            customErrorMessage: `Kunne ikke hente komponenter for organisasjonen: ${organisationName}.`,
            customSuccessMessage: `Komponenter for organisasjonen ${organisationName} ble hentet.`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }
}

export default ComponentApi;
