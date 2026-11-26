import { type LoaderFunction } from 'react-router';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ComponentApi from '~/api/ComponentApi';
import ComponentConfigApi from '~/api/ComponentConfigApi';
import LinkWalkerApi from '~/api/LinkWalkerApi';

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);

    const components = await ComponentApi.getOrganisationComponents(orgName);
    const configs = await ComponentConfigApi.getComponentConfigs();
    const testsResponse = await LinkWalkerApi.getTests(orgName);
    const relationTests =
        testsResponse.success && Array.isArray(testsResponse.data) ? testsResponse.data : null;
    const relationTestsLoadFailed =
        relationTests === null && !(testsResponse.success && testsResponse.status === 204);

    return Response.json({
        components: components.data,
        relationTests: relationTests ?? [],
        relationTestsLoadFailed,
        configs: configs.data,
        success: false,
        message: `Oppdatering av testresultater`,
        variant: 'success',
    });
};
