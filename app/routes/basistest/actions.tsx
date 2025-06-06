import { getSelectedOrganization } from '~/utils/selectedOrganization';
import BasicTestApi from '~/api/BasicTestApi';
import logger from '~/utils/logger';

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

    logger.silly(`cache request data: ${JSON.stringify(cacheData)}`);
    logger.silly(`health request data: ${JSON.stringify(healthData.data)}`);

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
