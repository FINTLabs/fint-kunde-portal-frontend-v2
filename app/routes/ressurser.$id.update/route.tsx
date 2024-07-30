import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import AssetApi from '~/api/AssetApi';
import { getFormData, getRequestParam } from '~/utils/requestUtils';
import { getSelectedOprganization } from '~/utils/selectedOrganization';

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const actionName = 'action update';
    const formData = await request.formData();
    const id = getRequestParam(params.id, 'id'); // TODO: fix it with invariant

    const actionType = formData.get('actionType') || '';

    const orgName = await getSelectedOprganization(request);

    let response = null;
    switch (actionType) {
        case 'UPDATE_CLIENT_IN_ASSET':
            let clientUpdateType = getFormData(
                formData.get('updateType'),
                'updateType',
                actionName
            );
            const clientName = getFormData(formData.get('clientName'), 'clientName', actionName);
            response = await AssetApi.updateClientInAsset(
                clientName,
                id,
                orgName,
                clientUpdateType
            );
            return json({ ok: response.status === 204 ? true : false });
        case 'UPDATE_ADAPTER_IN_ASSET':
            let adapterUpdateType = getFormData(
                formData.get('updateType'),
                'updateType',
                actionName
            );
            const adapterName = getFormData(formData.get('adapterName'), 'adapterName', actionName);
            response = await AssetApi.updateAdapterInAsset(
                adapterName,
                id,
                orgName,
                adapterUpdateType
            );
            return json({ ok: response.status === 204 ? true : false });
        default:
            const description = getFormData(formData.get('description'), 'description', actionName);
            response = await AssetApi.updateAsset({ name: id, description: description }, orgName);
            return json({ ok: response.status === 200 ? true : false });
    }
};
