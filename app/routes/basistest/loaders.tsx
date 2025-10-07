import type { LoaderFunction } from 'react-router';

import ClientApi from '~/api/ClientApi';
import ComponentApi from '~/api/ComponentApi';
import { IClient } from '~/types/Clients';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export const loader: LoaderFunction = async ({ request }) => {
    const selectOrg = await getSelectedOrganization(request);

    const components = await ComponentApi.getOrganisationComponents(selectOrg);
    const clients = await ClientApi.getClients(selectOrg);

    const filteredClients = (clients?.data ?? []).filter((client: IClient) => !client.managed);

    return Response.json({
        components: components.data,
        clients: filteredClients,
    });
};
