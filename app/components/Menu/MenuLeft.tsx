import { Button, HStack } from '@navikt/ds-react';
import { Logo } from './Logo';
import { MENU_ITEMS_LEFT } from './constants';
import { MenuDropdowns } from './MenuDropdowns';
import { Link } from '@remix-run/react';

export const MenuLeft = () => {
    return (
        <HStack gap="2">
            <Logo />
            <MenuDropdowns renderItems={MENU_ITEMS_LEFT.dropdowns} />
            <Link to="/samtykke" className="!uppercase !hover:bg-transparent">
                <Button as="a" variant="tertiary-neutral" className=" !text-neutral !uppercase">
                    Samtykke
                </Button>
            </Link>
        </HStack>
    );
};
