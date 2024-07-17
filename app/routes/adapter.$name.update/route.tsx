import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import AdapterAPI from '~/api/AdapterApi';
import { getSelectedOprganization } from '~/utils/selectedOrganization';
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

    const orgName = await getSelectedOprganization(request);
    await AdapterAPI.updateAdapter(
        {
            name: name,
            shortDescription: shortDescription as string,
            note: note as string,
        },
        orgName
    );
    return redirect(`/adapter/${name}`);
};
