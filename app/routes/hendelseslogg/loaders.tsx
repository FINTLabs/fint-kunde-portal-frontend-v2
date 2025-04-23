import { LoaderFunction } from '@remix-run/node';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ComponentApi from '~/api/ComponentApi';
import ComponentConfigApi from '~/api/ComponentConfigApi';

export const loader: LoaderFunction = async ({ request }) => {
    const selectOrg = await getSelectedOrganization(request);

    const components = await ComponentApi.getOrganisationComponents(selectOrg);
    const configs = await ComponentConfigApi.getComponentConfigs();

    return new Response(
        JSON.stringify({
            components: components.data,
            configs: configs.data,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
};
