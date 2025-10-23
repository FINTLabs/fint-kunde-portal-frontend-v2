import type { LoaderFunctionArgs } from 'react-router';

import AdapterApi from '~/api/AdapterApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ComponentApi from '~/api/ComponentApi';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const orgName = await getSelectedOrganization(request);
    // const adapterName = params.name;

    const [adaptersResponse] = await Promise.all([
        AdapterApi.getAdapters(orgName),
    ]);

    const componentsResponse = await ComponentApi.getAllComponents();
    // console.log('accessResponse', accessResponse);

    return Response.json({
        adapters: adaptersResponse.data,
        components: componentsResponse.data,
        orgName,
    });
};
