import { NovariApiManager, type ApiResponse } from 'novari-frontend-components';

import { IComponentConfig } from '~/types';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.API_URL || '';
const componentConfigManager = new NovariApiManager({
    baseUrl: API_URL,
});

class ComponentConfigApi {
    static async getComponentConfigs(): Promise<ApiResponse<IComponentConfig[]>> {
        return await componentConfigManager.call<IComponentConfig[]>({
            method: 'GET',
            endpoint: '/api/components/configurations',
            functionName: 'getComponentConfigs',
            customErrorMessage: 'Kunne ikke hente komponentkonfigurasjoner',
            customSuccessMessage: 'Komponentkonfigurasjoner ble hentet.',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }
}

export default ComponentConfigApi;
