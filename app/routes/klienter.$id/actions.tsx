import { redirect } from 'react-router';

import AccessApi from '~/api/AccessApi';
import ClientApi from '~/api/ClientApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export async function handleClientAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const orgName = await getSelectedOrganization(request);
    const clientName = formData.get('clientId') as string;
    const actionType = formData.get('actionType') as string;
    let secretResponse = null;

    switch (actionType) {
        case 'ADD_ACCESS':
            return await AccessApi.addAccess(clientName);

        case 'UPDATE_ENVIRONMENT': {
            const username = formData.get('username') as string;
            const environments = formData.getAll('environments[]') as string[];
            return await AccessApi.updateEnvironments(username, environments);
        }

        case 'UPDATE_CLIENT':
            return await ClientApi.updateClient(
                clientName,
                formData.get('shortDescription') as string,
                formData.get('note') as string,
                orgName
            );

        case 'DELETE_CLIENT':
            await ClientApi.deleteClient(clientName, orgName);
            await AccessApi.deleteAccess(clientName);
            return redirect(`/klienter?deleted=${clientName}`);

        case 'ADD_COMPONENT_ACCESS_OLD':
            return await ClientApi.updateComponentInClient(
                formData.get('componentName') as string,
                clientName,
                orgName,
                formData.get('isChecked') as string
            );
        case 'ADD_COMPONENT_ACCESS': {
            const username = formData.get('username') as string;
            const componentName = formData.get('componentName') as string;
            const enabled = formData.get('enabled') as string;

            // if (enabled === 'true' && response.success) {
            //     return redirect(`/tilgang/${username}/${componentName}?addedNew=true`);
            // }

            return await AccessApi.addComponentAccess(username, componentName, enabled);
        }
        // return await ClientApi.updateComponentInClient(
        //     formData.get('componentName') as string,
        //     clientName,
        //     orgName,
        //     formData.get('isChecked') as string
        // );

        case 'UPDATE_PASSWORD':
            return await ClientApi.setPassword(
                formData.get('entityName') as string,
                formData.get('password') as string,
                orgName
            );

        case 'GET_SECRET':
            secretResponse = await ClientApi.getOpenIdSecret(
                formData.get('entityName') as string,
                orgName
            );
            return {
                clientSecret: secretResponse.data,
                message: 'Klienthemmeligheten ble hentet',
                variant: 'success',
            };

        default:
            return {
                success: false,
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            };
    }
}
