import { type ActionFunctionArgs } from 'react-router';

import AccessApi from '~/api/AccessApi';
import ClientApi from '~/api/ClientApi';
// import FeaturesApi from '~/api/FeaturesApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ComponentApi from '~/api/ComponentApi';

export async function loader({ request, params }: ActionFunctionArgs) {
    const orgName = await getSelectedOrganization(request);
    const id = params.id || '';

    const clientResponse = await ClientApi.getClientById(orgName, id);

    //TODO: FIX this when access control is fully implemented
    // const featuresResponse = await FeaturesApi.fetchFeatures();
    // const hasAccessControl = id && featuresResponse.data?.['access-controll-new'];
    const hasAccessControl = false;

    const [accessResponse, componentListResponse, auditResponse, accessLogResponse] =
        hasAccessControl
            ? await Promise.all([
                  AccessApi.getClientOrAdapterAccess(id),
                  AccessApi.getClientOrAdapterAccessComponents(id),
                  AccessApi.getAccessAudit(id),
                  AccessApi.getAccessLogs(id),
              ])
            : [null, null, null, null];

    //TODO: Remove this when access control is fully implemented
    const componentsResponse = await ComponentApi.getAllComponents();

    return Response.json({
        client: clientResponse,
        access: accessResponse?.data,
        accessComponentList: componentListResponse?.data,
        accessAuditLogs: auditResponse?.data || null,
        accessLog: accessLogResponse?.data || null,
        hasAccessControl,
        components: componentsResponse.data,
    });
}
