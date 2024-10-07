import { IUserSession } from '~/types/types';
import { Select } from '@navikt/ds-react';
import { ChangeEvent, useState } from 'react';
import { useSubmit } from '@remix-run/react';

export const UserOrganization = ({ userSession }: { userSession: IUserSession }) => {
    const submit = useSubmit();

    const [orgName, setOrgName] = useState(userSession.selectedOrganization?.displayName);

    const handleOrgChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setOrgName(event.target.value);
        console.info(`Change org to ${event.target.value}`);

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
                <div className="flex items-center">{orgName}</div>
            )}
            {userSession.organizations.length > 1 && (
                <Select
                    size={'small'}
                    label="Velg organisasjon"
                    hideLabel
                    onChange={handleOrgChange}
                    defaultValue={orgName}>
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
