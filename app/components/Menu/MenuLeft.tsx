import { HStack } from '@navikt/ds-react';
import { Logo } from './Logo';
import { MENU_ITEMS_LEFT } from './constants';
import { MenuDropdowns } from './renderMenuItem';
import { Samtykke } from './Samtykke';

type MenuLeftType = {
    displaySamtykke: boolean;
};
export const MenuLeft = ({ displaySamtykke }: MenuLeftType) => {
    return (
        <HStack gap="2">
            <Logo />
            <MenuDropdowns renderItems={MENU_ITEMS_LEFT.dropdowns} />
            <Samtykke displaySamtykke={displaySamtykke} />
        </HStack>
    );
};
