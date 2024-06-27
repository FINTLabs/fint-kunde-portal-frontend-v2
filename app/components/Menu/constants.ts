import { MenuDropDown } from '~/types/MenuDropDown';

export const MENU_ITEMS_LEFT: MenuDropDown[] = [
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
    {
        title: 'Samtykke',
        subMenus: [],
    },
];
