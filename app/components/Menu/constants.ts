import { MenuDropDown } from '~/types/MenuDropDown';
import { MenuItem } from '~/types/MenuItem';
import {
    BriefcaseIcon,
    ComponentIcon,
    FileIcon,
    LayersIcon,
    MigrationIcon,
    PersonGroupIcon,
    TerminalIcon,
} from '@navikt/aksel-icons'; // Import relevant icons

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
                    icon: PersonGroupIcon, // Add icon here
                },
                {
                    title: 'Komponenter',
                    path: '/komponenter',
                    icon: ComponentIcon,
                },
                {
                    title: 'Adaptere',
                    path: '/adaptere',
                    icon: BriefcaseIcon,
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
                },
                {
                    title: 'Basistest',
                    path: '/basistest',
                    icon: TerminalIcon,
                },
                {
                    title: 'Relasjonstest',
                    path: '/relasjonstest',
                    icon: TerminalIcon,
                },
            ],
        },
    ],
    links: [
        {
            title: 'Samtykke',
            path: '/samtykke',
            icon: FileIcon, // Add icon here
        },
    ],
};
