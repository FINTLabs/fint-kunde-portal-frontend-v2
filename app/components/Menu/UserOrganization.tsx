import { IUserSession } from '~/types/types';
import { Select } from '@navikt/ds-react';
import { ChangeEvent } from 'react';
import { useSubmit } from '@remix-run/react';

export const UserOrganization = ({ userSession }: { userSession: IUserSession }) => {
    const submit = useSubmit();

    const handleOrgChange = (event: ChangeEvent<HTMLSelectElement>) => {
        let selectedOrg: { name: string; orgNumber: string; displayName: string };
        selectedOrg = userSession.organizations.filter(
            (org) => org.displayName === event.target.value
        )[0];
        userSession.selectedOrganization = selectedOrg;

        submit(
            {
                selectedOrganization: event.target.value,
                actionType: 'UPDATE_SELECTED_ORGANIZATION',
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
