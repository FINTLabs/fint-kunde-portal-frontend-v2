import { redirect } from '@remix-run/node';
import AdapterApi from '~/api/AdapterApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export async function handleAdapterAction({ request, params }: { request: Request; params: any }) {
    const name = params.name || '';
    const formData = await request.formData();
    const orgName = await getSelectedOrganization(request);
    const actionType = formData.get('actionType') as string;

    switch (actionType) {
        case 'UPDATE_PASSWORD':
            return await AdapterApi.setPassword(
                formData.get('entityName') as string,
                formData.get('password') as string,
                orgName
            );

        case 'GET_SECRET': {
            const secret = await AdapterApi.getOpenIdSecret(
                formData.get('entityName') as string,
                orgName
            );
            return {
                clientSecret: secret.data,
                message: 'Adapterhemmelighet ble hentet',
                variant: 'success',
            };
        }

        case 'UPDATE_ADAPTER':
            return await AdapterApi.updateAdapter(
                {
                    name,
                    shortDescription: formData.get('shortDescription') as string,
                    note: formData.get('note') as string,
                },
                orgName
            );

        case 'UPDATE_COMPONENT_IN_ADAPTER':
            return await AdapterApi.updateComponentInAdapter(
                formData.get('componentName') as string,
                formData.get('adapterName') as string,
                orgName,
                formData.get('isChecked') as string
            );

        case 'DELETE_ADAPTER':
            await AdapterApi.deleteAdapter(name, orgName);
            return redirect(`/adaptere?deleted=${name}`);

        default:
            return {
                success: false,
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            };
    }
}
