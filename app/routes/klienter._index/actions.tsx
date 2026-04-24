import { redirect } from 'react-router';

import ClientApi from '~/api/ClientApi';
import { IPartialClient } from '~/types/Clients';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export async function handleClientIndexAction({ request }: { request: Request }) {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const note = formData.get('note') as string;
    const modelVersion = formData.get('modelVersion') as string;

    const orgName = await getSelectedOrganization(request);

    const newClient: IPartialClient = {
        name,
        note,
        shortDescription: description,
        modelVersion,
    };

    const response = await ClientApi.createClient(newClient, orgName);
    console.log('DEBUGGIN:', response);

    if (!response.success) {
        if (response.status === 409) {
            throw new Response('Klienten eksisterer allerede.', { status: 409 });
        }
        throw new Response('Kunne ikke opprette ny klient.', { status: 500 });
    }

    return redirect(`/klienter/${response.data?.name}`);
}
