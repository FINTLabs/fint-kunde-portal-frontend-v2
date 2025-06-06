import { LoaderFunction } from '@remix-run/node';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ClientApi from '~/api/ClientApi';

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);
    const clientsResponse = await ClientApi.getClients(orgName);

    const clientData = clientsResponse.data || [];
    clientData.sort((a: { shortDescription: string }, b: { shortDescription: string }) =>
        a.shortDescription.localeCompare(b.shortDescription)
    );

    return new Response(JSON.stringify({ clientData, orgName }), {
        headers: { 'Content-Type': 'application/json' },
    });
};
