import { HStack } from '@navikt/ds-react';
import { UserSession } from '~/api/types';
import { LogoutButton } from './LogoutButton';
import { Logo } from './Logo';
import { MENU_ITEMS_LEFT } from './constants';
import { UserOrganization } from './UserOrganization';
import { renderMenuItem } from './renderMenuItem';

export default function Menu({
    userSession,
    displaySamtykke,
}: {
    userSession: UserSession;
    displaySamtykke: boolean;
}) {
    return (
        <div className="flex justify-between">
            <MenuLeft displaySamtykke={displaySamtykke} />
            <MenuRight userSession={userSession} />
        </div>
    );
}

const MenuLeft = ({ displaySamtykke }: { displaySamtykke: boolean }) => {
    const menuItems = displaySamtykke
        ? MENU_ITEMS_LEFT
        : MENU_ITEMS_LEFT.filter((item) => item.title !== 'Samtykke');

    return (
        <HStack gap="2">
            <Logo />
            {menuItems.map(renderMenuItem)}
        </HStack>
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
