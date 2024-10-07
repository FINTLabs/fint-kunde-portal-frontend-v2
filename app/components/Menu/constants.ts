import { MenuDropDown } from '~/types/MenuDropDown';
import { MenuItem } from '~/types/MenuItem';
import {
    ArrowsSquarepathIcon,
    BriefcaseIcon,
    ComponentIcon,
    LayersIcon,
    MigrationIcon,
    PassportIcon,
    PersonGroupIcon,
    TerminalIcon,
} from '@navikt/aksel-icons';

type MenuItemsLeft = {
    dropdowns: MenuDropDown[];
    links: MenuItem[];
};

export const MENU_ITEMS_LEFT: MenuItemsLeft = {
    dropdowns: [
        {
            title: 'TILGANGER',
            subMenus: [
                {
                    title: 'Kontakter',
                    path: '/kontakter',
                    icon: PersonGroupIcon,
                    role: 'ROLE_ORGANISATION',
                },
                {
                    title: 'Komponenter',
                    path: '/komponenter',
                    icon: ComponentIcon,
                    role: 'ROLE_COMPONENT',
                },
                {
                    title: 'Adaptere',
                    path: '/adaptere',
                    icon: BriefcaseIcon,
                    role: 'ROLE_ADAPTER',
                },
                {
                    title: 'Klienter',
                    path: '/klienter',
                    icon: MigrationIcon,
                },
                {
                    title: 'Ressurser',
                    path: '/ressurser',
                    icon: LayersIcon,
                    role: 'ROLE_ASSET',
                },
            ],
        },
        {
            title: 'HELSE',
            subMenus: [
                {
                    title: 'Hendelseslogg',
                    path: '/hendelseslogg',
                    icon: TerminalIcon,
                    role: 'ROLE_LOG',
                },
                {
                    title: 'Basistest',
                    path: '/basistest',
                    icon: TerminalIcon,
                    role: 'ROLE_LOG',
                },
                {
                    title: 'Relasjonstest',
                    path: '/relasjonstest',
                    icon: ArrowsSquarepathIcon,
                    role: 'ROLE_LOG',
                },
            ],
        },
    ],
    links: [
        {
            title: 'Samtykke',
            path: '/samtykke',
            icon: PassportIcon,
        },
    ],
};
