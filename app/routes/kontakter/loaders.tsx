import { LoaderFunction } from '@remix-run/node';
import ContactApi from '~/api/ContactApi';
import RoleApi from '~/api/RolesApi';
import OrganisationApi from '~/api/OrganisationApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export const loader: LoaderFunction = async ({ request }) => {
    const selectedOrg = await getSelectedOrganization(request);

    const technicalContactsResponse = await ContactApi.getTechnicalContacts(selectedOrg);
    const technicalContacts = technicalContactsResponse.success
        ? technicalContactsResponse.data
        : [];
    if (technicalContacts) {
        technicalContacts.sort((a: { firstName: string }, b: { firstName: string }) =>
            a.firstName.localeCompare(b.firstName)
        );
    }

    const rolesDataResponse = await RoleApi.getRoles();
    const legalContactResponse = await OrganisationApi.getLegalContact(selectedOrg);
    const allContactsResponse = await ContactApi.getAllContacts();

    return new Response(
        JSON.stringify({
            technicalContacts,
            rolesData: rolesDataResponse.data,
            legalContact: legalContactResponse.data,
            allContacts: allContactsResponse.data,
            selectedOrg,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
};
