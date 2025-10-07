import { LoaderFunction } from 'react-router';

import ClientApi from '~/api/ClientApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);
    const clientsResponse = await ClientApi.getClients(orgName);

    const clientData = clientsResponse.data || [];
    clientData.sort((a: { shortDescription: string }, b: { shortDescription: string }) =>
        a.shortDescription.localeCompare(b.shortDescription)
    );

    return Response.json({ clientData, orgName });
};
