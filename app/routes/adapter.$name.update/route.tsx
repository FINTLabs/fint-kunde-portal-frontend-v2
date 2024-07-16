import { ActionFunctionArgs, redirect } from '@remix-run/node';
import AdapterAPI from '~/api/AdapterApi';
import { getSelectedOprganization } from '~/utils/selectedOrganization';

export const action = async ({ request, params }: ActionFunctionArgs) => {
    console.log('Called update');
    const formData = await request.formData();

    const name = params.name;
    const shortDescription = formData.get('shortDescription');
    const note = formData.get('note');

    console.log(formData);

    if (!name) throw new Response('Failed to update. No name in params', { status: 404 });
    if (!shortDescription)
        throw new Response('Failed to update. No shortDescription in form data', { status: 404 });
    if (!shortDescription)
        throw new Response('Failed to update. No shortDescription in form data', { status: 404 });

    const orgName = await getSelectedOprganization(request);
    const res = await AdapterAPI.updateAdapter(
        {
            name: name,
            shortDescription: shortDescription as string,
            note: note as string,
        },
        orgName
    );

    console.log('response in update');
    console.log(res);
    return redirect(`/adapter/${params.name}`);
};
