import { type LoaderFunction } from 'react-router';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ComponentApi from '~/api/ComponentApi';
import ComponentConfigApi from '~/api/ComponentConfigApi';
import LinkWalkerApi from '~/api/LinkWalkerApi';

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);

    const components = await ComponentApi.getOrganisationComponents(orgName);
    const configs = await ComponentConfigApi.getComponentConfigs();
    const relationTests = await LinkWalkerApi.getTests(orgName);

    return Response.json({
        components: components.data,
        relationTests: relationTests.data,
        configs: configs.data,
        success: false,
        message: `Oppdatering av testresultater`,
        variant: 'success',
    });
};
