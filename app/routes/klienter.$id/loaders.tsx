import { type ActionFunctionArgs } from 'react-router';

import AccessApi from '~/api/AccessApi';
import ClientApi from '~/api/ClientApi';
// import FeaturesApi from '~/api/FeaturesApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import FeaturesApi from '~/api/FeaturesApi';

export async function loader({ request, params }: ActionFunctionArgs) {
    const orgName = await getSelectedOrganization(request);
    const id = params.id || '';

    const clientResponse = await ClientApi.getClientById(orgName, id);
    const featuresResponse = await FeaturesApi.fetchFeatures();
    const hasAccessControl = id && featuresResponse.data?.['access-controll-new'];
    // const hasAccessControl = false;

    const [accessResponse, componentListResponse, auditResponse] = hasAccessControl
        ? await Promise.all([
              AccessApi.getClientOrAdapterAccess(id),
              AccessApi.getClientOrAdapterAccessComponents(id),
              AccessApi.getAccessAudit(id),
          ])
        : [null, null, null];

    return Response.json({
        client: clientResponse,
        access: accessResponse?.data,
        accessComponentList: componentListResponse?.data,
        accessAuditLogs: auditResponse?.data || [],
        hasAccessControl,
    });
}
