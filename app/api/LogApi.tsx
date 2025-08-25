import { NovariApiManager, type ApiResponse } from 'novari-frontend-components';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.API_URL || '';
const logManager = new NovariApiManager({
    baseUrl: API_URL,
    defaultHeaders: {
        'x-nin': HeaderProperties.getXnin(),
    },
});

class LogApi {
    static async getLogs(
        environment: string,
        organisation: string,
        componentName: string,
        resource: string,
        type: string
    ): Promise<ApiResponse<any>> {
        const functionName = 'getLogs';
        const formattedComponent = componentName.replace(/_/g, '-');
        const formattedType = `${type}_${resource.toUpperCase()}`;

        return await logManager.call<any>({
            method: 'GET',
            endpoint: `/api/events/${organisation}/${environment}/${formattedComponent}/${formattedType}`,
            functionName,
            customErrorMessage: 'Kunne ikke hente logger for spesifisert ressurs.',
            customSuccessMessage: 'Logger for spesifisert ressurs ble hentet.',
        });
    }
}

export default LogApi;
