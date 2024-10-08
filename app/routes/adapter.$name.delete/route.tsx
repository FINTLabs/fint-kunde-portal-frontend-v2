import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import AdapterAPI from '~/api/AdapterApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const name = getRequestParam(params.name, 'name');
    const orgName = await getSelectedOrganization(request);

    const response = await AdapterAPI.deleteAdapter(name, orgName);
    if (response.status === 204) {
        return redirect(`/adaptere?deleted=${name}`);
    } else {
        return json({ status: response.status, error: 'Could not delete adapter' });
    }
};

function getRequestParam(value: string | undefined, name: string) {
    if (!value)
        throw new Response(`Failed to update. Invalid ${name} in request params`, { status: 400 });

    return value;
}
