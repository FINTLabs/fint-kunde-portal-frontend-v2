import { redirect } from '@remix-run/node';
import AdapterAPI from '~/api/AdapterApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { IPartialAdapter } from '~/types/Adapter';

export async function handleAdapterIndexAction({ request }: { request: Request }) {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const detailedInfo = formData.get('detailedInfo') as string;

    const orgName = await getSelectedOrganization(request);
    const newAdapter: IPartialAdapter = {
        name,
        shortDescription: description,
        note: detailedInfo,
    };

    const response = await AdapterAPI.createAdapter(newAdapter, orgName);

    if (!response.success) {
        throw new Response('Kunne ikke opprette ny adapter.', { status: 500 });
    }

    return redirect(`/adapter/${response.data?.name}`);
}
