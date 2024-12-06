import { Select } from '@navikt/ds-react';
import { ChangeEvent, useState } from 'react';
import { useSubmit } from '@remix-run/react';
import { IUserSession } from '~/types/Session';

export const UserOrganization = ({ userSession }: { userSession: IUserSession }) => {
    const submit = useSubmit();

    const [orgName, setOrgName] = useState(userSession.selectedOrganization?.name);

    const handleOrgChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setOrgName(event.target.value);
        console.info(`Change org to ${event.target.value}`);

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
                <div className="flex items-center">{userSession.organizations[0].displayName}</div>
            )}
            {userSession.organizations.length > 1 && (
                <Select
                    size={'small'}
                    label="Velg organisasjon"
                    hideLabel
                    onChange={handleOrgChange}
                    value={orgName}>
                    {userSession.organizations.map((org, index) => (
                        <option key={`key-${index}`} value={org.name}>
                            {org.displayName}
                        </option>
                    ))}
                </Select>
            )}
        </>
    );
};
