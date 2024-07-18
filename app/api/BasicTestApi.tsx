// import { request } from '~/api/shared/api';
// import { log } from '~/utils/logger';

// const API_URL = process.env.API_URL;

class LogApi {
    static async runTest(orgName: string, test: string) {
        const request = new Request(`/api/tests/${orgName}/basic`, {
            method: 'POST',
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify(test),
        });

        return fetch(request).then((response) => Promise.all([response, response.json()]));
    }
}

export default LogApi;
