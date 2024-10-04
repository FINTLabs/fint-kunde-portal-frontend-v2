import { Button, HStack } from '@navikt/ds-react';
import { Logo } from './Logo';
import { MENU_ITEMS_LEFT } from './constants';
import { MenuDropdowns } from './MenuDropdowns';
import { Link, useLoaderData } from '@remix-run/react';

export const MenuLeft = () => {
    const { features } = useLoaderData<Record<string, boolean>>();
    return (
        <HStack gap="2">
            <Logo />
            <MenuDropdowns renderItems={MENU_ITEMS_LEFT.dropdowns} />
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
