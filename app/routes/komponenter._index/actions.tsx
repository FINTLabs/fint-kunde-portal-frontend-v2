import { getSelectedOrganization } from '~/utils/selectedOrganization';
import OrganisationApi from '~/api/OrganisationApi';

export async function handleComponentIndexAction({ request }: { request: Request }) {
    const formData = await request.formData();

    const orgName = await getSelectedOrganization(request);
    const componentName = formData.get('componentName') as string;
    const isChecked = formData.get('isChecked') === 'true';

    return await OrganisationApi.updateComponent(componentName, orgName, isChecked);
}
