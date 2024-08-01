import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import AdapterAPI from '~/api/AdapterApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { getRequestParam, getFormData } from '../../utils/requestUtils';

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const actionName = 'action update';
    const formData = await request.formData();
    const name = getRequestParam(params.name, 'name');
    const shortDescription = getFormData(
        formData.get('shortDescription'),
        'shortDescription',
        actionName
    );

    const note = getFormData(formData.get('note'), 'note', actionName);

    const orgName = await getSelectedOrganization(request);

    const actionType = formData.get('actionType') || '';

    let response = null;

    // switch (actionType) {
    //     case 'UPDATE_CLIENT_IN_ASSET':
    //         let clientUpdateType = getFormData(
    //             formData.get('updateType'),
    //             'updateType',
    //             actionName
    //         );
    //         const clientName = getFormData(formData.get('clientName'), 'clientName', actionName);
    //         response = await AssetApi.updateClientInAsset(
    //             clientName,
    //             id,
    //             orgName,
    //             clientUpdateType
    //         );
    //         return json({ ok: response.status === 204 ? true : false });
    //     case 'UPDATE_ADAPTER_IN_ASSET':
    //         let adapterUpdateType = getFormData(
    //             formData.get('updateType'),
    //             'updateType',
    //             actionName
    //         );
    //         const adapterName = getFormData(formData.get('adapterName'), 'adapterName', actionName);
    //         response = await AssetApi.updateAdapterInAsset(
    //             adapterName,
    //             id,
    //             orgName,
    //             adapterUpdateType
    //         );
    //         return json({ ok: response.status === 204 ? true : false });
    //     default:
    //         response = await AdapterAPI.updateAdapter(
    //             {
    //                 name: name,
    //                 shortDescription: shortDescription as string,
    //                 note: note as string,
    //             },
    //             orgName
    //         );

    //         console.log("response.status")
    //         console.log(response.status)
    //         return json({ ok: response.status === 200 ? true : false });

    return redirect(`/adapter/${name}`);
};
