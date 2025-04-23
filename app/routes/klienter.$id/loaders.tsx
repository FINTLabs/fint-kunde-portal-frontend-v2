import { ActionFunctionArgs } from '@remix-run/node';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ClientApi from '~/api/ClientApi';
import ComponentApi from '~/api/ComponentApi';
import FeaturesApi from '~/api/FeaturesApi';
import AccessApi from '~/api/AccessApi';

export async function loader({ request, params }: ActionFunctionArgs) {
    const orgName = await getSelectedOrganization(request);
    const id = params.id || '';

    const clientResponse = await ClientApi.getClientById(orgName, id);
    const componentsResponse = await ComponentApi.getOrganisationComponents(orgName);
    const featuresResponse = await FeaturesApi.fetchFeatures();
    const hasAccessControl = id && featuresResponse.data?.['access-controll-new'];

    const [accessResponse, componentListResponse] = hasAccessControl
        ? await Promise.all([
              AccessApi.getClientorAdapterAccess(id),
              AccessApi.getClientorAdapterAccessComponents(id),
          ])
        : [null, null];

    return new Response(
        JSON.stringify({
            client: clientResponse,
            components: componentsResponse.data,
            features: featuresResponse.data,
            access: accessResponse?.data,
            accessComponentList: componentListResponse?.data,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
}
