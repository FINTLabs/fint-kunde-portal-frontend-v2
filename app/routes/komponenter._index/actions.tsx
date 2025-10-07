import OrganisationApi from '~/api/OrganisationApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export async function handleComponentIndexAction({ request }: { request: Request }) {
    const formData = await request.formData();

    const orgName = await getSelectedOrganization(request);
    const componentName = formData.get('componentName') as string;
    const isChecked = formData.get('isChecked') === 'true';

    return await OrganisationApi.updateComponent(componentName, orgName, isChecked);
}
