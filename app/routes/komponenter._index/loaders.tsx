import type { LoaderFunction } from '@remix-run/node';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ComponentApi from '~/api/ComponentApi';

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);
    const components = await ComponentApi.getAllComponents();

    return new Response(JSON.stringify({ components: components.data, orgName: orgName }), {
        headers: { 'Content-Type': 'application/json' },
    });
};
