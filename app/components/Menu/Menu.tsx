import { Dropdown, HStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { UserSession } from '~/api/types';
import { Button } from '@navikt/ds-react';
import { LogoutButton } from './LogoutButton';
import { MenuDropDown } from '../../types/MenuDropDown';
import { NavLinkView } from './NavLinkView';
import { Logo } from './Logo';
import { MENU_ITEMS_LEFT } from './constants';

export default function Menu({ userSession }: { userSession: UserSession }) {
    return (
        <div className="flex justify-between">
            <MenuLeft />
            <MenuRight userSession={userSession} />
        </div>
    );
}

const MenuLeft = () => (
    <HStack>
        <Logo />
        {MENU_ITEMS_LEFT.map(renderMenuItem)}
    </HStack>
);

const UserOrganization = ({ userSession }: { userSession: UserSession }) => {
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
const MenuRight = ({ userSession }: { userSession: UserSession }) => (
    <HStack gap="5">
        <div className="flex items-center">
            <UserOrganization userSession={userSession} />
        </div>
        <div className="flex items-center">{userSession.firstName}</div>
        <div className="flex items-center">
            <LogoutButton />
        </div>
    </HStack>
);

const renderMenuItem = (item: MenuDropDown, index: number) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dropdown
            key={`key-${index}`}
            defaultOpen={false}
            open={isOpen}
            onOpenChange={() => setIsOpen(!isOpen)}>
            <Button
                style={{
                    backgroundColor: isOpen ? 'var(--a-lightblue-700)' : 'transparent',
                    color: isOpen ? 'var(--a-gray-50)' : 'var(--a-gray-800)',
                }}
                variant="tertiary"
                as={Dropdown.Toggle}>
                {item.title}
            </Button>
            <Dropdown.Menu
                className="!border-0 !"
                style={{
                    borderRadius: 'var(--a-spacing-0)',
                    padding: 'var(--a-spacing-0)',
                }}
                placement="bottom-start">
                <Dropdown.Menu.List>
                    {item.subMenus.map((subMenu, index) => (
                        <Dropdown.Menu.List.Item
                            className="!p-0"
                            key={`key-${index}`}
                            onClick={() => {
                                if (isOpen) setIsOpen(!isOpen);
                            }}>
                            <NavLinkView item={subMenu}></NavLinkView>
                        </Dropdown.Menu.List.Item>
                    ))}
                </Dropdown.Menu.List>
            </Dropdown.Menu>
        </Dropdown>
    );
};
