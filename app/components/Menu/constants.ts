import { MenuItems } from '~/types/MenuItems';

export const MENU_ITEMS_LEFT: MenuItems[] = [
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
];
