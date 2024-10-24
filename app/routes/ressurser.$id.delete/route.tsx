import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import AssetApi from '~/api/AssetApi';
import { getRequestParam } from '~/utils/requestUtils';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const id = getRequestParam(params.id, 'id');
    const orgName = await getSelectedOrganization(request);
    const response = await AssetApi.deleteAsset(id, orgName);
    if (response) {
        return redirect(`/ressurser?deleted=${id}`);
    } else {
        return json({ status: response.status, error: 'Failed to delete resource' });
    }
};
