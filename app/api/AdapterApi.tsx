import { log, error } from '~/utils/logger';
import { API_URL } from './constants';

class AdapterAPI {
    static async getAdapters(organisationName: string) {
        try {
            log('Fetching adapters', `${API_URL}/api/adapters/${organisationName}`);

            const response = await fetch(`${API_URL}/api/adapters/${organisationName}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'x-nin': process.env.PERSONALNUMBER || '',
                },
            });

            if (response.ok) {
                return await response.json();
            } else {
                error('Error fetching adapters, status:', response.status);
                return null;
            }
        } catch (err) {
            error('Error fetching adapters:', err);
            throw new Error('Error fetching adapters');
        }
    }

    // static updateAdapter(adapter, organisation) {
    //     const request = new Request(`/api/adapters/${organisation}/${adapter.name}`, {
    //         method: 'PUT',
    //         headers: {
    //             Accept: '*/*',
    //             'Content-Type': 'application/json',
    //         },
    //         credentials: 'same-origin',
    //         body: JSON.stringify({
    //             name: adapter.name,
    //             note: adapter.note,
    //             shortDescription: adapter.shortDescription,
    //         }),
    //     });
    //     return fetch(request)
    //         .then((response) => {
    //             return response.json();
    //         })
    //         .catch((error) => {
    //             return error;
    //         });
    // }
}
export default AdapterAPI;
