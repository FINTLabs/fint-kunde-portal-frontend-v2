import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import AdapterAPI from '~/api/AdapterApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { getRequestParam, getFormData } from '../../utils/requestUtils';

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const actionName = 'action update';
    const formData = await request.formData();
    const adapterName = getRequestParam(params.name, 'name');

    const orgName = await getSelectedOrganization(request);

    const actionType = formData.get('actionType') || '';

    let response = null;

    switch (actionType) {
        case 'UPDATE_COMPONENT_IN_ADAPTER':
            let clientUpdateType = getFormData(
                formData.get('updateType'),
                'updateType',
                actionName
            );
            const componentName = getFormData(
                formData.get('componentName'),
                'componentName',
                actionName
            );
            response = await AdapterAPI.updateComponentInAdapter(
                componentName,
                adapterName,
                orgName,
                clientUpdateType
            );
            return json({ ok: response.status === 204 ? true : false });
        default:
            const shortDescription = getFormData(
                formData.get('shortDescription'),
                'shortDescription',
                actionName
            );

            const note = getFormData(formData.get('note'), 'note', actionName);

            response = await AdapterAPI.updateAdapter(
                {
                    name: adapterName,
                    shortDescription: shortDescription as string,
                    note: note as string,
                },
                orgName
            );
            return redirect(`/adapter/${adapterName}`);
    }
    // return json({ ok: response.status === 200 ? true : false });
};
