import type { LoaderFunctionArgs } from 'react-router';

import AccessApi from '~/api/AccessApi';
import AdapterApi from '~/api/AdapterApi';
import FeaturesApi from '~/api/FeaturesApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const orgName = await getSelectedOrganization(request);
    const adapterName = params.name;

    const [adaptersResponse, featuresResponse] = await Promise.all([
        AdapterApi.getAdapters(orgName),
        FeaturesApi.fetchFeatures(),
    ]);

    const hasAccessControl = adapterName && featuresResponse.data?.['access-controll-new'];

    const [accessResponse, componentListResponse] = hasAccessControl
        ? await Promise.all([
              AccessApi.getClientOrAdapterAccess(adapterName),
              AccessApi.getClientOrAdapterAccessComponents(adapterName),
          ])
        : [null, null];
    console.log('accessResponse', accessResponse);

    return Response.json({
        adapters: adaptersResponse.data,
        features: featuresResponse.data,
        access: accessResponse?.data,
        accessComponentList: componentListResponse?.data,
        orgName,
    });
};
