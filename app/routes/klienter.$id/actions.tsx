import { redirect } from 'react-router';
import ClientApi from '~/api/ClientApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import AccessApi from '~/api/AccessApi';

export async function handleClientAction({ request, params }: { request: Request; params: any }) {
    const formData = await request.formData();
    const orgName = await getSelectedOrganization(request);
    const clientName = params.id || '';
    const actionType = formData.get('actionType') as string;

    switch (actionType) {
        case 'ADD_ACCESS':
            return await AccessApi.addAccess(clientName);

        case 'UPDATE_ENVIRONMENT': {
            const environments = formData.getAll('environments[]') as string[];
            return await AccessApi.updateEnvironments(clientName, environments);
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

        case 'ADD_COMPONENT_ACCESS':
            return await AccessApi.addComponentAccess(
                clientName,
                formData.get('componentName') as string,
                formData.get('enabled') as string
            );
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
            const secretResponse = await ClientApi.getOpenIdSecret(
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
