import { request } from '~/api/shared/api';
import { API_URL } from '~/api/constants';

class AccessApi {
    static async getAllAccess(organisation: string) {
        const functionName = 'getAccess';
        const URL = `${API_URL}/api/accesses/${organisation}/`;
        return request(URL, functionName);
    }
    static async getAccessTemplates() {
        const functionName = 'getAccessTemplates';
        const URL = `${API_URL}/api/accesspackage/template`;
        return request(URL, functionName);
    }
}

export default AccessApi;
