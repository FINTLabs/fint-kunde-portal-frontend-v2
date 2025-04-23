import type { LoaderFunction } from '@remix-run/node';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ComponentApi from '~/api/ComponentApi';
import ClientApi from '~/api/ClientApi';
import { IClient } from '~/types/Clients';

export const loader: LoaderFunction = async ({ request }) => {
    const selectOrg = await getSelectedOrganization(request);

    const components = await ComponentApi.getOrganisationComponents(selectOrg);
    const clients = await ClientApi.getClients(selectOrg);

    const filteredClients = (clients?.data ?? []).filter((client: IClient) => !client.managed);

    return new Response(
        JSON.stringify({
            components: components.data,
            clients: filteredClients,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
};
