import { IUserSession } from '~/types/types';
import { Select } from '@navikt/ds-react';
import { ChangeEvent } from 'react';
import { useSubmit } from '@remix-run/react';

export const UserOrganization = ({ userSession }: { userSession: IUserSession }) => {
    const submit = useSubmit();

    const handleOrgChange = (event: ChangeEvent<HTMLSelectElement>) => {
        submit(
            {
                selectedOrganization: event.target.value,
                actionType: 'UPDATE_SELECTED_ORGANIZATION', // not used
            },
            {
                method: 'POST',
                navigate: false,
            }
        );
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
                    {/* The selected org should display on top */}
                    <option value={userSession.selectedOrganization?.name}>
                        {userSession.selectedOrganization?.displayName}
                    </option>
                    {userSession.organizations
                        .filter((org) => org.name !== userSession.selectedOrganization?.name)
                        .map((org, index) => (
                            <option key={`key-${index}`} value={org.displayName}>
                                {org.displayName}
                            </option>
                        ))}
                </Select>
            )}
        </>
    );
};
