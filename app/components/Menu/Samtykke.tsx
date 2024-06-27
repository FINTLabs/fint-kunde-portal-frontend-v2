import { MENU_ITEMS_LEFT } from './constants';
import { NavLink } from '@remix-run/react';
import { Button } from '@navikt/ds-react';

type SamtykkeType = {
    displaySamtykke: boolean;
};

export function Samtykke({ displaySamtykke }: SamtykkeType) {
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
