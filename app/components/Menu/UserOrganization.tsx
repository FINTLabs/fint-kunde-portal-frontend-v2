import { IUserSession } from '~/types/types';
import { Select } from '@navikt/ds-react';
import { ChangeEvent } from 'react';

export const UserOrganization = ({ userSession }: { userSession: IUserSession }) => {
    // if (userSession.selectedOrganization) {
    //     console.log('userSession.selectedOrganization');
    //     console.log(userSession.selectedOrganization);
    //     const organizationExtra = userSession.selectedOrganization;
    //     organizationExtra.displayName = 'ANUM organization';
    //     userSession.organizations.push(organizationExtra);
    // }

    const handleOrgChange = (event: ChangeEvent<HTMLSelectElement>) => {
        let selectedOrg: { name: string; orgNumber: string; displayName: string };
        selectedOrg = userSession.organizations.filter(
            (org) => org.displayName === event.target.value
        )[0];
        userSession.selectedOrganization = selectedOrg;
    };

    return (
        <>
            {userSession.organizations.length === 1 && (
                <div className="flex items-center">
                    {userSession.selectedOrganization?.displayName}
                </div>
            )}
            {userSession.organizations.length > 1 && (
                <Select label="Velg organisasjon" hideLabel onChange={handleOrgChange}>
                    {userSession.organizations.map((org, index) => (
                        <option key={`key-${index}`} value={org.displayName}>
                            {org.displayName}
                        </option>
                    ))}
                </Select>
            )}
        </>
    );
};
