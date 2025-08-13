import { ActionFunctionArgs } from 'react-router';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ClientApi from '~/api/ClientApi';
import FeaturesApi from '~/api/FeaturesApi';
import AccessApi from '~/api/AccessApi';

export async function loader({ request, params }: ActionFunctionArgs) {
    const orgName = await getSelectedOrganization(request);
    const id = params.id || '';

    const clientResponse = await ClientApi.getClientById(orgName, id);
    const featuresResponse = await FeaturesApi.fetchFeatures();
    const hasAccessControl = id && featuresResponse.data?.['access-controll-new'];

    const [accessResponse, componentListResponse] = hasAccessControl
        ? await Promise.all([
              AccessApi.getClientorAdapterAccess(id),
              AccessApi.getClientorAdapterAccessComponents(id),
          ])
        : [null, null];

    return Response.json({
        client: clientResponse,
        features: featuresResponse.data,
        access: accessResponse?.data,
        accessComponentList: componentListResponse?.data,
    });
}
