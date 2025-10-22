import { NovariApiManager, type ApiResponse } from 'novari-frontend-components';

import type { AuditEvent } from '~/types';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.API_URL || '';
const logManager = new NovariApiManager({
    baseUrl: API_URL,
});

class LogApi {
    static async getLogs(
        environment: string,
        organisation: string,
        componentName: string,
        resource: string,
        type: string
    ): Promise<ApiResponse<AuditEvent[]>> {
        const functionName = 'getLogs';
        const formattedComponent = componentName.replace(/_/g, '-');
        const formattedType = `${type}_${resource.toUpperCase()}`;

        return await logManager.call<AuditEvent[]>({
            method: 'GET',
            endpoint: `/api/events/${organisation}/${environment}/${formattedComponent}/${formattedType}`,
            functionName,
            customErrorMessage: 'Kunne ikke hente logger for spesifisert ressurs.',
            customSuccessMessage: 'Logger for spesifisert ressurs ble hentet.',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }
}

export default LogApi;
