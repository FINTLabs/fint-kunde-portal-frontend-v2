import { HStack } from '@navikt/ds-react';
import { useRef } from 'react';
import { UserSession } from '~/api/types';
import { LogoutButton } from './LogoutButton';
import { Logo } from './Logo';
import { MENU_ITEMS_LEFT } from './constants';
import { UserOrganization } from './UserOrganization';
import { renderMenuItem } from './renderMenuItem';

export default function Menu({ userSession }: { userSession: UserSession }) {
    return (
        <div className="flex justify-between">
            <MenuLeft />
            <MenuRight userSession={userSession} />
        </div>
    );
}

const MenuLeft = () => (
    <HStack gap="2">
        <Logo />
        {MENU_ITEMS_LEFT.map(renderMenuItem)}
    </HStack>
);

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
