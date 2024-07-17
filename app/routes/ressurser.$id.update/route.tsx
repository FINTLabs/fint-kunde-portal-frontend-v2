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
    console.log(id);
    console.log(description);
    const response = await AssetApi.updateAccess({ name: id, description: description }, orgName);
    console.log('response in action');
    console.log(response);
    return redirect(`/ressurser/${id}`);
};
