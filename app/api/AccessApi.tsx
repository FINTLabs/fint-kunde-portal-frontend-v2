import { request } from '~/api/shared/api';

const API_URL = process.env.ACCESS_URL;
class AccessApi {
    static async getAccess(name: string) {
        const functionName = 'getAccess';
        const URL = `${API_URL}/access/${name}`;
        return await request(URL, functionName);
    }
}

export default AccessApi;
