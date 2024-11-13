import { Button, HStack } from '@navikt/ds-react';
import { Logo } from './Logo';
import { MENU_ITEMS_LEFT } from './constants';
import { MenuDropdowns } from './MenuDropdowns';
import { Link } from '@remix-run/react';
import { IUserSession } from '~/types/Session';
// import MenuComponent from '~/components/Menu/MenuComponent';

type MenuLeftType = {
    userSession: IUserSession;
};

export const MenuLeft = ({ userSession }: MenuLeftType) => {
    //TODO: beta menu goes here
    return (
        <HStack gap="2">
            <Logo />
            <MenuDropdowns renderItems={MENU_ITEMS_LEFT.dropdowns} />
            {/*<MenuComponent />*/}
            {userSession.features['samtykke-admin-new' as keyof typeof userSession.features] && (
                <Link to="/samtykke" className="!uppercase !hover:bg-transparent">
                    <Button variant="tertiary-neutral" className="!text-neutral !uppercase">
                        Samtykke
                    </Button>
                </Link>
            )}
        </HStack>
    );
};
