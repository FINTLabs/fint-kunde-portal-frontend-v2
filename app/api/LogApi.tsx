import { API_URL } from '~/api/constants';
import { request } from '~/api/shared/api';
//TODO api url not working?

class LogApi {
    static async getLogs(environment: string, organisation: string, query: string) {
        const functionName = 'getLogs';
        const URL = `${API_URL}/api/events/${organisation}/${environment}/${query}`;
        return await request(URL, functionName);
    }
}
export default LogApi;
