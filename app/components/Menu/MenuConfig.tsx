import {
    ArrowsSquarepathIcon,
    ComponentIcon,
    LayersIcon,
    MigrationIcon,
    PersonGroupIcon,
    TasklistSendIcon,
    TerminalIcon,
    TokenIcon,
} from '@navikt/aksel-icons';
import type { TFunction } from 'i18next';

import { getHelpData } from '~/routes/help/HelpData';

export const getFooterLinks = (t: TFunction) => [
    { label: t('footer.incidents'), href: 'https://novari.no/driftsmeldinger/' },
    { label: t('footer.support'), href: 'http://support.novari.no' },
    { label: t('footer.help'), href: 'http://fintlabs.no' },
    { label: t('footer.glossary'), href: '/help/' },
    { label: t('footer.testClient'), href: 'https://api.felleskomponent.no/' },
];

export const getFooterLinksNotLoggedIn = (t: TFunction) => [
    { label: t('footer.incidents'), href: 'https://novari.no/driftsmeldinger/' },
    { label: t('footer.support'), href: 'http://support.novari.no' },
    { label: t('footer.help'), href: 'http://fintlabs.no' },
    { label: t('footer.testClient'), href: 'https://api.felleskomponent.no/' },
];
export const getNovariMenu = (t: TFunction) => {
    const helpData = getHelpData(t);
    return [
    {
        action: '/',
        label: t('menu.dashboard'),
        description: t('menu.dashboardDescription'),
        displayBox: false,
    },
    {
        action: '',
        label: t('menu.access'),
        submenu: [
            {
                action: '/kontakter',
                icon: <PersonGroupIcon title="Kontakter" fontSize="1.5rem" />,
                label: t('menu.contacts'),
                role: 'ROLE_ORGANISATION',
                description: helpData.find((i) => i.id === 'contacts')?.shortDescription,
            },
            {
                action: '/komponenter',
                icon: <ComponentIcon title="Komponenter" fontSize="1.5rem" />,
                label: t('menu.components'),
                role: 'ROLE_COMPONENT',
                description: helpData.find((i) => i.id === 'components')?.shortDescription,
            },
            {
                action: '/adaptere',
                icon: <LayersIcon title="Adaptere" fontSize="1.5rem" />,
                label: t('menu.adapters'),
                role: 'ROLE_ADAPTER',
                description: helpData.find((i) => i.id === 'adapter')?.shortDescription,
            },
            {
                action: '/klienter',
                icon: <TokenIcon title="Klienter" fontSize="1.5rem" />,
                label: t('menu.clients'),
                role: 'ROLE_CLIENT',
                description: helpData.find((i) => i.id === 'klienter')?.shortDescription,
            },
            {
                action: '/ressurser',
                icon: <MigrationIcon title="Ressurser" fontSize="1.5rem" />,
                label: t('menu.resources'),
                role: 'ROLE_ASSET',
                description: helpData.find((i) => i.id === 'assets')?.shortDescription,
            },
        ],
    },
    {
        action: '',
        label: t('menu.health'),
        submenu: [
            {
                action: '/hendelseslogg',
                icon: <TasklistSendIcon title="Hendelseslogg" fontSize="1.5rem" />,
                label: t('menu.eventLog'),
                role: 'ROLE_LOG',
                description: helpData.find((i) => i.id === 'hendelseslogg')?.shortDescription,
            },
            {
                action: '/basistest',
                icon: <TerminalIcon title="Basistest" fontSize="1.5rem" />,
                label: t('menu.basicTest'),
                role: 'ROLE_LOG',
                description: helpData.find((i) => i.id === 'basistest')?.shortDescription,
            },
            {
                action: '/relasjonstest',
                icon: <ArrowsSquarepathIcon title="Relasjonstest" fontSize="1.5rem" />,
                label: t('menu.relationTest'),
                role: 'ROLE_LOG',
                description: helpData.find((i) => i.id === 'relasjonstest')?.shortDescription,
            },
        ],
    },
    // {
    //     action: '',
    //     label: 'Status Service',
    //     submenu: [
    //         {
    //             action: '/status/adaptere',
    //             icon: <VitalsIcon title="Status Adaptere" fontSize="1.5rem" />,
    //             label: 'Status Adaptere',
    //             role: 'ROLE_LOG',
    //             description: helpData.find((i) => i.id === 'statusKontrakter')?.shortDescription,
    //         },
    //         {
    //             action: '/status/hendelser',
    //             icon: <TasklistSendIcon title="Status Hendelser" fontSize="1.5rem" />,
    //             label: 'Status Hendelser',
    //             role: 'ROLE_LOG',
    //             description: helpData.find((i) => i.id === 'statusHendelser')?.shortDescription,
    //         },
    //     ],
    // },
    ];
};
