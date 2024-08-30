import { request } from '~/api/shared/api';

const API_URL = process.env.LINKWALKER_API_URL;

class LinkWalkerApi {
    static async getTests(orgName: string) {
        const functionName = 'getTests';
        const URL = `${API_URL}/link-walker/tasks/${orgName}`;
        return request(URL, functionName).catch((err) => {
            console.error('Error fetching relations tests :', err);
        });
    }

    static async addTest(test: string, orgName: string) {
        console.log(JSON.stringify(test));
        const request = new Request(`${API_URL}/link-walker/tasks/${orgName}`, {
            method: 'POST',
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify(test),
        });

        return fetch(request)
            .then((response) => {
                if (response.ok) {
                    return { message: 'test added', variant: 'info' };
                } else {
                    return {
                        message: 'Det oppsto en feil',
                        variant: 'error',
                    };
                }
            })
            .catch((error) => {
                error(error.message);
                return {
                    message: 'Det oppsto en feil.',
                    variant: 'error',
                };
            });
    }
}

export default LinkWalkerApi;
