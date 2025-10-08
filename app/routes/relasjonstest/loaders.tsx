import { type LoaderFunction } from 'react-router';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ComponentApi from '~/api/ComponentApi';
import ClientApi from '~/api/ClientApi';
import ComponentConfigApi from '~/api/ComponentConfigApi';
import LinkWalkerApi from '~/api/LinkWalkerApi';
import { IClient } from '~/types/Clients';

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);

    const components = await ComponentApi.getOrganisationComponents(orgName);
    const clients = await ClientApi.getClients(orgName);
    const configs = await ComponentConfigApi.getComponentConfigs();
    const relationTests = await LinkWalkerApi.getTests(orgName);

    const filteredClients = (clients?.data ?? []).filter((client: IClient) => !client.managed);

    return Response.json({
        components: components.data,
        clients: filteredClients,
        relationTests: relationTests.data,
        configs: configs.data,
        success: false,
        message: `Oppdatering av testresultater`,
        variant: 'success',
    });
};
