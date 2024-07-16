import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import AdapterAPI from '~/api/AdapterApi';
import { getSelectedOprganization } from '~/utils/selectedOrganization';

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const actionName = 'action update';
    const formData = await request.formData();
    const name = getRequstParam(params.name, 'name');
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
    return redirect(`/adapter/${params.name}`);
};

function getRequstParam(value: string | undefined, name: string) {
    if (!value)
        throw new Response(`Failed to update. Invalid ${name} in request params`, { status: 400 });

    return value;
}

function getFormData(value: FormDataEntryValue | null, name: string, actionName: string) {
    if (!value)
        throw new Response(`Failed in ${actionName}. Invalid ${name} in formData`, {
            status: 400,
        });

    return value;
}
