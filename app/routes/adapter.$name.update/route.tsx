import { ActionFunctionArgs, redirect } from '@remix-run/node';
import AdapterAPI from '~/api/AdapterApi';
import { getSelectedOprganization } from '~/utils/selectedOrganization';

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const name = params.name;
    const shortDescription = formData.get('shortDescription');
    const note = formData.get('note');

    if (!name)
        throw new Response('Failed to update. Invalid name in request params', { status: 400 });
    if (!shortDescription)
        throw new Response('Failed to update. Invalid shortDescriptio in formData', {
            status: 400,
        });
    if (!note) throw new Response('Failed to update. Invalid note in formData', { status: 400 });

    const orgName = await getSelectedOprganization(request);
    const res = await AdapterAPI.updateAdapter(
        {
            name: name,
            shortDescription: shortDescription as string,
            note: note as string,
        },
        orgName
    );

    return redirect(`/adapter/${params.name}`);
};
