import LogApi from '~/api/LogApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export async function handleLogAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const environment = formData.get('environment') as string;
    const componentName = formData.get('component') as string;
    const action = formData.get('action') as string;
    const resource = formData.get('resource') as string;

    const orgName = await getSelectedOrganization(request);

    const response = await LogApi.getLogs(environment, orgName, componentName, resource, action);

    if (!response.success || response.data.length === 0) {
        return {
            success: false,
            message: `Kunne ikke hente logger for spesifisert ressurs.`,
            variant: 'error',
        };
    }

    return response;
}
