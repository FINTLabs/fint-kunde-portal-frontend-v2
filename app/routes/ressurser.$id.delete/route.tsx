import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import AssetApi from '~/api/AssetApi';
import { getRequestParam } from '~/utils/requestUtils';
import { getSelectedOprganization } from '~/utils/selectedOrganization';

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const id = getRequestParam(params.id, 'id'); // TODO: fix it with invariant
    const orgName = await getSelectedOprganization(request);
    const response = await AssetApi.deleteAsset(id, orgName);
    if (response.status === 204) {
        // TODO: find out how to display a message that the record was deleted
        return redirect(`/ressurser`);
    } else {
        return json({ status: response.status, error: 'Failed to delete resource' });
    }
};
