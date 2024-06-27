import { Dropdown, HStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import logo from '../../public/images/logo.png';
import { UserSession } from '~/api/types';
import { LeaveIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Modal } from '@navikt/ds-react';
import { useNavigate } from '@remix-run/react';
import { LogoutButton } from './LogoutButton';
import { MenuItems } from '../../types/MenuItems';
import { NavLinkItem } from '~/types/NavLinkItem';
import { NavLinkView } from './NavLinkView';

const renderMenuItems = (item: MenuItems, index: number) => {
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
                    // border: "var(--a-spacing-0)",
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

// const LogoNavLink = (
//     <NavLink to="/" className={'flex items-center'}>
//         <img src={logo} width={100} height={50} />
//     </NavLink>
// );

export default function Menu({ userSession }: { userSession: UserSession }) {
    console.log(userSession);

    const original = userSession.organizations[0];
    const obj = userSession.organizations[0];
    const cloned = { ...obj };
    cloned.displayName = 'Some other org';

    userSession.organizations = [original, cloned];

    return (
        <div className="flex justify-between">
            <HStack>
                {/* {LogoNavLink} */}
                {MENU_ITEMS_LEFT.map(renderMenuItems)}
            </HStack>
            <HStack gap="5">
                {userSession.organizations.length === 1 && (
                    <div className="flex items-center">
                        {userSession.selectedOrganization?.displayName}
                    </div>
                )}
                {userSession.organizations.length > 1 && (
                    <Dropdown>
                        <Button as={Dropdown.Toggle}>
                            {userSession.organizations[0].displayName}
                        </Button>
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
                <div className="flex items-center">{userSession.firstName}</div>
                <div className="flex items-center">
                    <LogoutButton />
                </div>
            </HStack>
        </div>
    );
}

const MENU_ITEMS_LEFT: MenuItems[] = [
    {
        title: 'TILGANGER',
        subMenus: [
            {
                title: 'Kontakter',
                path: '/kontakter',
            },
            {
                title: 'Komponenter',
                path: '/komponenter',
            },
            {
                title: 'Adapter',
                path: '/adapter',
            },
            {
                title: 'Klienter',
                path: '/klienter',
            },
            {
                title: 'Ressurser',
                path: '/ressurser',
            },
            {
                title: 'Hendelseslogg',
                path: '/hendelseslogg',
            },
        ],
    },
    {
        title: 'HELSE',
        subMenus: [
            {
                title: 'Basistest',
                path: '/basistest',
            },
            {
                title: 'Relasjonstest',
                path: '/relasjonstest',
            },
        ],
    },
];
