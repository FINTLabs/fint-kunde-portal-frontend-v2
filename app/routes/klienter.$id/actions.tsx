import { redirect } from 'react-router';
import AccessApi from '~/api/AccessApi';
import ClientApi from '~/api/ClientApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import AnalyticsApi from '~/api/AnalyticsApi';

export async function handleClientAction({ request }: { request: Request }) {
    const formData = await request.formData();

    const orgName = await getSelectedOrganization(request);
    const clientName = formData.get('clientId') as string;
    const actionType = formData.get('actionType') as string;
    const username = formData.get('username') as string;

    let response;

    switch (actionType) {
        case 'ADD_ACCESS':
            response = await AccessApi.addAccess(clientName);
            break;

        case 'UPDATE_ENVIRONMENT': {
            const environments = formData.getAll('environments[]') as string[];
            response = await AccessApi.updateEnvironments(username, environments);
            break;
        }

        case 'UPDATE_CLIENT':
            response = await ClientApi.updateClient(
                clientName,
                formData.get('shortDescription') as string,
                formData.get('note') as string,
                formData.get('modelVersion') as string,
                orgName
            );
            break;

        case 'DELETE_CLIENT':
            response = await ClientApi.deleteClient(clientName, orgName);

            if (response?.success === false) {
                break;
            }

            return redirect(`/klienter?deleted=${clientName}`);

        case 'ADD_COMPONENT_ACCESS':
            response = await ClientApi.updateComponentInClient(
                formData.get('componentName') as string,
                username,
                orgName,
                formData.get('enabled') as string
            );
            break;

        case 'ADD_COMPONENT_ACCESS_NEW': {
            const componentName = formData.get('componentName') as string;
            const enabled = formData.get('enabled') as string;

            response = await AccessApi.addComponentAccess(username, componentName, enabled);
            break;
        }

        case 'UPDATE_PASSWORD':
            response = await ClientApi.setPassword(
                formData.get('entityName') as string,
                formData.get('password') as string,
                orgName
            );
            break;

        case 'GET_SECRET': {
            const secretResponse = await ClientApi.getOpenIdSecret(
                formData.get('entityName') as string,
                orgName
            );

            response =
                secretResponse.status === 200
                    ? {
                          success: true,
                          clientSecret: secretResponse.data,
                          message: 'Klienthemmeligheten ble hentet',
                          variant: 'success',
                      }
                    : {
                          success: false,
                          status: secretResponse.status ?? 500,
                          message: 'Kunne ikke hente klienthemmeligheten',
                          variant: 'error',
                      };

            break;
        }

        default:
            response = {
                success: false,
                status: 400,
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            };
    }

    if (response?.success === false) {
        void AnalyticsApi.trackError(
            new URL(request.url).pathname,
            response.message,
            response.status ?? 500,
            orgName,
            actionType
        );
    }

    return response;
}
