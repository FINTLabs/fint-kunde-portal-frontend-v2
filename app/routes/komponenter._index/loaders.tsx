import type { LoaderFunction } from 'react-router';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ComponentApi from '~/api/ComponentApi';

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);
    const components = await ComponentApi.getAllComponents();

    return Response.json({ components: components.data, orgName: orgName });
};
