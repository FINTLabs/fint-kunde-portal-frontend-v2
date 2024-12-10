import { apiManager, handleApiResponse, ApiResponse } from '~/api/ApiManager';

const API_URL = process.env.API_URL;

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

        const URL = `${API_URL}/api/events/${organisation}/${environment}/${formattedComponent}/${formattedType}`;

        const apiResults = await apiManager<any>({
            method: 'GET',
            url: URL,
            functionName,
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke hente logger for spesifisert ressurs.',
            'Logger for spesifisert ressurs ble hentet.',
            'success'
        );
    }
}

export default LogApi;
