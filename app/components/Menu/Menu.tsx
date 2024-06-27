import { HStack } from '@navikt/ds-react';
import { UserSession } from '~/api/types';
import { LogoutButton } from './LogoutButton';
import { Logo } from './Logo';
import { MENU_ITEMS_LEFT } from './constants';
import { UserOrganization } from './UserOrganization';
import { MenuDropdowns, renderMenuItem } from './renderMenuItem';
import { NavLinkView } from './NavLinkView';
import { NavLink } from '@remix-run/react';
import { Button } from '@navikt/ds-react';

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
    return (
        <HStack gap="2">
            <Logo />
            <MenuDropdowns renderItems={MENU_ITEMS_LEFT.dropdowns} />
            <Samtykke displaySamtykke={displaySamtykke} />
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

function Samtykke({ displaySamtykke }: { displaySamtykke: boolean }) {
    return (
        <div className="flex items-center">
            {displaySamtykke &&
                MENU_ITEMS_LEFT.links.map((item, index) => (
                    <NavLink key={`index-${index}`} to={item.path}>
                        <Button variant="tertiary" className="!uppercase hover:bg-transparent">
                            {item.title}
                        </Button>
                    </NavLink>
                ))}
        </div>
    );
}
