import { request } from '~/api/shared/api';
import { log } from '~/utils/logger';

const API_URL = process.env.API_URL;

class LogApi {
    static async getLogs(environment: string, organisation: string, query: string) {
        const functionName = 'getLogs';
        const URL = `${API_URL}/api/events/${organisation}/${environment}/${query}`;

        const results = await request(URL, functionName, '');
        log('results from request:', results);
        // if (results) return results;
        // else return 'no logs found';
        return results;
    }
}

export default LogApi;
