import { type LoaderFunction } from 'react-router';

import ContactApi from '~/api/ContactApi';
import OrganisationApi from '~/api/OrganisationApi';
import RoleApi from '~/api/RolesApi';
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

    return {
        technicalContacts,
        rolesData: rolesDataResponse.data,
        legalContact: legalContactResponse.data,
        allContacts: allContactsResponse.data,
        selectedOrg,
    };
};
