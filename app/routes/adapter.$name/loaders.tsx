import type { LoaderFunctionArgs } from '@remix-run/node';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import AdapterApi from '~/api/AdapterApi';
import ComponentApi from '~/api/ComponentApi';
import FeaturesApi from '~/api/FeaturesApi';
import AccessApi from '~/api/AccessApi';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const orgName = await getSelectedOrganization(request);
    const adapterName = params.name;

    const [adaptersResponse, componentsResponse, featuresResponse] = await Promise.all([
        AdapterApi.getAdapters(orgName),
        ComponentApi.getOrganisationComponents(orgName),
        FeaturesApi.fetchFeatures(),
    ]);

    const accessResponse =
        adapterName && featuresResponse.data?.['access-controll-new']
            ? await AccessApi.getClientorAdapterAccess(adapterName)
            : null;

    return new Response(
        JSON.stringify({
            adapters: adaptersResponse.data,
            components: componentsResponse.data,
            features: featuresResponse.data,
            access: accessResponse?.data,
            orgName,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
};
