import { MenuDropDown } from '~/types/MenuDropDown';
import { MenuItem } from '~/types/MenuItem';

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
                },
                {
                    title: 'Komponenter',
                    path: '/komponenter',
                },
                {
                    title: 'Adapter',
                    path: '/adapter',
                },
                {
                    title: 'Klienter',
                    path: '/klienter',
                },
                {
                    title: 'Ressurser',
                    path: '/ressurser',
                },
                {
                    title: 'Hendelseslogg',
                    path: '/hendelseslogg',
                },
            ],
        },
        {
            title: 'HELSE',
            subMenus: [
                {
                    title: 'Basistest',
                    path: '/basistest',
                },
                {
                    title: 'Relasjonstest',
                    path: '/relasjonstest',
                },
            ],
        },
    ],
    links: [
        {
            title: 'Samtykke',
            path: '/samtykke',
        },
    ],
};
