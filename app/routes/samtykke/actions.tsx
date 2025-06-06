import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ConsentApi from '~/api/ConsentApi';

export async function handleConsentAction({ request }: { request: Request }) {
    const orgName = await getSelectedOrganization(request);
    const formData = await request.formData();
    const actionType = formData.get('actionType');

    switch (actionType) {
        case 'SET_ACTIVE':
            return await ConsentApi.setActive(
                orgName,
                formData.get('policyId') as string,
                formData.get('setIsActive') as string
            );

        case 'ADD_SERVICE': {
            const serviceName = formData.get('newServiceName') as string;
            return await ConsentApi.createService(serviceName, orgName);
        }

        case 'ADD_POLICY':
            return await ConsentApi.createPolicy(
                formData.get('serviceId') as string,
                formData.get('foundationId') as string,
                formData.get('personalDataId') as string,
                formData.get('description') as string,
                orgName
            );

        default:
            return {
                success: false,
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            };
    }
}
