import { Dropdown } from '@navikt/ds-react';
import { UserSession } from '~/api/types';
import { Button } from '@navikt/ds-react';

export const UserOrganization = ({ userSession }: { userSession: UserSession }) => {
    return (
        <>
            {userSession.organizations.length === 1 && (
                <div className="flex items-center">
                    {userSession.selectedOrganization?.displayName}
                </div>
            )}
            {userSession.organizations.length > 1 && (
                <Dropdown>
                    <Button as={Dropdown.Toggle}>{userSession.organizations[0].displayName}</Button>
                    <Dropdown.Menu>
                        <Dropdown.Menu.List>
                            {userSession.organizations.map((org) => {
                                return (
                                    <Dropdown.Menu.List.Item>
                                        {org.displayName}
                                    </Dropdown.Menu.List.Item>
                                );
                            })}
                        </Dropdown.Menu.List>
                    </Dropdown.Menu>
                </Dropdown>
            )}
        </>
    );
};
