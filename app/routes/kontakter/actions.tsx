import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ContactApi from '~/api/ContactApi';
import RoleApi from '~/api/RolesApi';

export async function handleContactsAction(request: Request) {
    const formData = await request.formData();
    const actionType = formData.get('actionType') as string;
    const contactNin = formData.get('contactNin') as string;
    const roleId = formData.get('roleId') as string;
    const roleName = formData.get('roleName') as string;

    const selectedOrg = await getSelectedOrganization(request);
    let response;

    switch (actionType) {
        case 'ADD_TECHNICAL_CONTACT':
            response = await ContactApi.addTechnicalContact(contactNin, selectedOrg);
            break;
        case 'REMOVE_CONTACT':
            response = await ContactApi.removeTechnicalContact(contactNin, selectedOrg);
            break;
        case 'SET_LEGAL_CONTACT':
            response = await ContactApi.setLegalContact(contactNin, selectedOrg);
            break;
        case 'ADD_ROLE':
            response = await RoleApi.addRole(selectedOrg, contactNin, roleId, roleName);
            break;
        case 'DELETE_ROLE':
            response = await RoleApi.removeRole(selectedOrg, contactNin, roleId, roleName);
            break;
        default:
            response = {
                success: false,
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            };
    }

    return response;
}
