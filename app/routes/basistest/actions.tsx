import log4js from 'log4js';

import BasicTestApi from '~/api/BasicTestApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
// import logger from '~/utils/logger';
const logger = log4js.getLogger();

export async function handleBasicTestAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const baseUrl = formData.get('baseUrl') as string;
    const endpoint = formData.get('endpoint') as string;
    const clientName = formData.get('clientName') as string;
    const orgName = await getSelectedOrganization(request);

    const message = 'Testet av: ';

    logger.debug(`BASIS TEST baseurl/endpoint clientName orgname: ${baseUrl}`);

    const cacheData = await BasicTestApi.runTest(orgName, baseUrl, endpoint, clientName);
    const healthData = await BasicTestApi.runHealthTest(orgName, baseUrl, endpoint, clientName);

    logger.debug(`cache request data: ${JSON.stringify(cacheData)}`);
    logger.debug(`health request data: ${JSON.stringify(healthData.data)}`);

    return {
        message,
        clientName,
        testUrl: baseUrl + endpoint,
        variant: cacheData.variant,
        data: {
            healthData: healthData.data || [],
            cacheData: cacheData.data || [],
        },
    };
}
