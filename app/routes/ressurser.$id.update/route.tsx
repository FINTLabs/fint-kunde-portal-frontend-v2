import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import AssetApi from '~/api/AssetApi';
import { getFormData, getRequestParam } from '~/utils/requestUtils';
import { getSelectedOprganization } from '~/utils/selectedOrganization';

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const actionName = 'action update';
    const formData = await request.formData();
    const id = getRequestParam(params.id, 'id');
    const description = getFormData(formData.get('description'), 'description', actionName);
    const orgName = await getSelectedOprganization(request);

    // Send api request here
    const response = await AssetApi.updateAccess()
    return redirect(`/ressurser/${id}`);
};
