import { request } from '~/api/shared/api';

const API_URL = process.env.API_URL;

class LogApi {
    static async getLogs(
        environment: string,
        organisation: string,
        componentName: string,
        resource: string,
        type: string
    ) {

        const functionName = 'getLogs';
        const formattedComponent = componentName.replace(/_/g, '-');
        const formattedType = type + '_' + resource.toUpperCase();

        // https://kunde-beta.felleskomponent.no/api/events/fintlabs_no/beta/utdanning-elev/GET_ALL_ELEVTILRETTELEGGING
        const URL = `${API_URL}/api/events/${organisation}/${environment}/${formattedComponent}/${formattedType}`;

        return await request(URL, functionName);
    }
}

export default LogApi;