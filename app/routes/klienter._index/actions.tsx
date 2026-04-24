import { redirect } from 'react-router';

import AnalyticsApi from '~/api/AnalyticsApi';
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

    if (!response.success) {
        const statusCode = response.status === 409 ? 409 : 500;
        const message =
            statusCode === 409 ? 'Klienten eksisterer allerede.' : 'Kunne ikke opprette ny klient.';

        await AnalyticsApi.trackError(new URL(request.url).pathname, message, statusCode, orgName);

        throw new Response(message, { status: statusCode });
    }

    return redirect(`/klienter/${response.data?.name}`);
}
