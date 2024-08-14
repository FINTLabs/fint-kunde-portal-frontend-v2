import { request } from '~/api/shared/api';
import { log } from '~/utils/logger';

const API_URL = process.env.API_URL;

class LogApi {
    static async getLogs(
        environment: string,
        organisation: string,
        componentName: string,
        type: string
    ) {
        const functionName = 'getLogs';
        // http://localhost:8080/events/{{orgName}}/{{environment}}/{{component}}/{{action}}
        const URL = `${API_URL}/api/events/${organisation}/${environment}/${componentName}/${type}`;

        return await request(URL, functionName, '');
    }
}

export default LogApi;
