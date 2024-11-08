import { Button, HStack } from '@navikt/ds-react';
import { Logo } from './Logo';
import { MENU_ITEMS_LEFT } from './constants';
import { MenuDropdowns } from './MenuDropdowns';
import { Link, useLoaderData } from '@remix-run/react';
// import MenuComponent from '~/components/Menu/MenuComponent';

export const MenuLeft = () => {
    const { features } = useLoaderData<Record<string, boolean>>();

    //TODO: beta menu goes here
    return (
        <HStack gap="2">
            <Logo />
            <MenuDropdowns renderItems={MENU_ITEMS_LEFT.dropdowns} />
            {/*<MenuComponent />*/}
            {features['samtykke-admin-new' as keyof typeof features] && (
                <Link to="/samtykke" className="!uppercase !hover:bg-transparent">
                    <Button variant="tertiary-neutral" className="!text-neutral !uppercase">
                        Samtykke
                    </Button>
                </Link>
            )}
        </HStack>
    );
};
