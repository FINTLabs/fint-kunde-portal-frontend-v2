import { ActionFunctionArgs, redirect } from '@remix-run/node';
import AdapterAPI from '~/api/AdapterApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import logger from '~/utils/logger';

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const name = getRequestParam(params.name, 'name');
    const orgName = await getSelectedOrganization(request);

    const response = await AdapterAPI.deleteAdapter(name, orgName);
    logger.debug('Delete adapter response: ', response.status);
    logger.debug('redirecting to adapter list');
    return redirect(`/adaptere?deleted=${name}`);
};

function getRequestParam(value: string | undefined, name: string) {
    if (!value)
        throw new Response(`Failed to update. Invalid ${name} in request params`, { status: 400 });

    return value;
}
