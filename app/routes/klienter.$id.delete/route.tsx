import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import ClientApi from '~/api/ClientApi';
import { getRequestParam } from '~/utils/requestUtils';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const id = getRequestParam(params.id, 'id');
    const orgName = await getSelectedOrganization(request);
    const response = await ClientApi.deleteClient(id, orgName);
    if (response.status === 204) {
        return redirect(`/klienter?deleted=${id}`);
    } else {
        return json({ status: response.status, error: 'Failed to delete resource' });
    }
};
