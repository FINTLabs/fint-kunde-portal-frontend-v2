import type { LoaderFunction } from 'react-router';

import ComponentApi from '~/api/ComponentApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);
    const components = await ComponentApi.getAllComponents();

    return Response.json({ components: components.data, orgName: orgName });
};
