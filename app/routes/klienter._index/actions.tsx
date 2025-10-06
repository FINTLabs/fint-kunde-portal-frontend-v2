import { redirect } from 'react-router';

import AccessApi from '~/api/AccessApi';
import ClientApi from '~/api/ClientApi';
import { IPartialClient } from '~/types/Clients';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export async function handleClientIndexAction({ request }: { request: Request }) {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const note = formData.get('note') as string;
    const orgName = await getSelectedOrganization(request);

    const newClient: IPartialClient = {
        name,
        note,
        shortDescription: description,
    };

    const response = await ClientApi.createClient(newClient, orgName);

    if (response.success) {
        await AccessApi.addAccess(response.data?.name as string);
    }

    if (!response.success) {
        throw new Response('Kunne ikke opprette ny klient.', { status: 500 });
    }

    return redirect(`/klienter/${response.data?.name}`);
}
