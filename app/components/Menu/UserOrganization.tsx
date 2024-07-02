import { UserSession } from '~/types/types';
import { Select } from '@navikt/ds-react';
import { ChangeEvent } from 'react';

const handleOrgChange = (event: ChangeEvent<HTMLSelectElement>) => {
    console.log('Org changed to ', event.target.value);

    // TODO: implement actual org change here
};

export const UserOrganization = ({ userSession }: { userSession: UserSession }) => {
    // if (userSession.selectedOrganization) {
    //     console.log('userSession.selectedOrganization');
    //     console.log(userSession.selectedOrganization);
    //     const organizationExtra = userSession.selectedOrganization;
    //     organizationExtra.displayName = 'ANUM organization';
    //     userSession.organizations.push(organizationExtra);
    // }

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
