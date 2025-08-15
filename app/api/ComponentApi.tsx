import { NovariApiManager, type ApiResponse } from 'novari-frontend-components';
import type { IClient } from '~/types/Clients'; // If you have a specific Component type, swap this.
import logger from '~/utils/logger';

const API_URL = process.env.API_URL || '';
const componentManager = new NovariApiManager({ baseUrl: API_URL });

class ComponentApi {
    static async getAllComponents(): Promise<ApiResponse<IClient[]>> {
        const res = await componentManager.call<IClient[]>({
            method: 'GET',
            endpoint: '/api/components',
            functionName: 'getAllComponents',
            customErrorMessage: 'Kunne ikke hente alle komponenter.',
            customSuccessMessage: 'Komponenter hentet.',
        });

        logger.silly(
            `FULL LIST OF COMPONENTS: ${JSON.stringify(res.data?.map((c) => c.name) ?? [], null, 2)}`
        );
        return res;
    }

    static async getComponentById(componentName: string): Promise<IClient | null> {
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
    ): Promise<ApiResponse<IClient[]>> {
        const res = await componentManager.call<IClient[]>({
            method: 'GET',
            endpoint: `/api/components/organisation/${organisationName}`,
            functionName: 'getOrganisationComponents',
            customErrorMessage: `Kunne ikke hente komponenter for organisasjonen: ${organisationName}.`,
            customSuccessMessage: `Komponenter for organisasjonen ${organisationName} ble hentet.`,
        });

        logger.silly(
            `LIST OF COMPONENTS FOR ORG: ${JSON.stringify(res.data?.map((c) => c.name) ?? [], null, 2)}`
        );
        return res;
    }
}

export default ComponentApi;
