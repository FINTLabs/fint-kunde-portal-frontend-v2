import { getSelectedOrganization } from '~/utils/selectedOrganization';
import LinkWalkerApi from '~/api/LinkWalkerApi';
import logger from '~/utils/logger';

export async function handleRelationTestAction({ request }: { request: Request }) {
    const orgName = await getSelectedOrganization(request);
    const formData = await request.formData();

    const testUrl = formData.get('testUrl');
    const clientName = formData.get('clientName');
    const actionType = formData.get('actionType') as string;

    logger.debug('ACTION TYPE relasjonstest', actionType);

    switch (actionType) {
        case 'ADD_TEST':
            return await LinkWalkerApi.addTest(testUrl as string, clientName as string, orgName);

        case 'CLEAR_TESTS':
            return await LinkWalkerApi.clearTests(orgName);

        default:
            return {
                success: false,
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            };
    }
}
