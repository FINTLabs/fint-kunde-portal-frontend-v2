import type { LoaderFunctionArgs } from '@remix-run/node';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import AdapterApi from '~/api/AdapterApi';
import FeaturesApi from '~/api/FeaturesApi';
import AccessApi from '~/api/AccessApi';

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
              AccessApi.getClientorAdapterAccess(adapterName),
              AccessApi.getClientorAdapterAccessComponents(adapterName),
          ])
        : [null, null];

    return new Response(
        JSON.stringify({
            adapters: adaptersResponse.data,
            features: featuresResponse.data,
            access: accessResponse?.data,
            accessComponentList: componentListResponse?.data,
            orgName,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
};
