import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import AssetApi from '~/api/AssetApi';
import { getFormData, getRequestParam } from '~/utils/requestUtils';
import { getSelectedOprganization } from '~/utils/selectedOrganization';

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const actionName = 'action update';
    const formData = await request.formData();
    console.log(formData);
    const id = getRequestParam(params.id, 'id'); // TODO: fix it with invariant

    const actionType = formData.get('actionType') || '';

    const orgName = await getSelectedOprganization(request);

    let response = null;
    switch (actionType) {
        case 'ADD_ADAPTER_TO_ASSET':
            const adapterName = getFormData(formData.get('adapterName'), 'adapterName', actionName);
            response = await AssetApi.addAdapterToAsset(adapterName, id, orgName);
            return json({ ok: response.status === 204 ? true : false });

        default:
            const description = getFormData(formData.get('description'), 'description', actionName);
            response = await AssetApi.updateAccess({ name: id, description: description }, orgName);
            return json({ ok: response.status === 200 ? true : false });
    }
};
