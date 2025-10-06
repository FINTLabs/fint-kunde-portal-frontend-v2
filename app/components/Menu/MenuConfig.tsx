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

import { helpData } from '~/routes/help/HelpData';

export const footerLinks = [
    { label: 'Driftsmeldinger', href: 'https://novari.no/driftsmeldinger/' },
    { label: 'Opprett supportsak', href: 'http://support.novari.no' },
    { label: 'Brukerhjelp', href: 'http://fintlabs.no' },
    { label: 'Ordliste', href: '/help/' },
    { label: 'FINT Test Client', href: 'https://api.felleskomponent.no/' },
];

export const novariMenu = [
    {
        action: '/',
        label: 'Dashboard',
        description: 'Oversikt over alle tilgjengelige tjenester',
        displayBox: false,
    },
    {
        action: '',
        label: 'Tilganger',
        submenu: [
            {
                action: '/kontakter',
                icon: <PersonGroupIcon title="Kontakter" fontSize="1.5rem" />,
                label: 'Kontakter',
                role: 'ROLE_ORGANISATION',
                description: helpData.find((i) => i.id === 'contacts')?.shortDescription,
            },
            {
                action: '/komponenter',
                icon: <ComponentIcon title="Komponenter" fontSize="1.5rem" />,
                label: 'Komponenter',
                role: 'ROLE_COMPONENT',
                description: helpData.find((i) => i.id === 'components')?.shortDescription,
            },
            {
                action: '/adaptere',
                icon: <LayersIcon title="Adaptere" fontSize="1.5rem" />,
                label: 'Adaptere',
                role: 'ROLE_ADAPTER',
                description: helpData.find((i) => i.id === 'adapter')?.shortDescription,
            },
            {
                action: '/klienter',
                icon: <TokenIcon title="Klienter" fontSize="1.5rem" />,
                label: 'Klienter',
                role: 'ROLE_CLIENT',
                description: helpData.find((i) => i.id === 'klienter')?.shortDescription,
            },
            {
                action: '/ressurser',
                icon: <MigrationIcon title="Ressurser" fontSize="1.5rem" />,
                label: 'Ressurser',
                role: 'ROLE_ASSET',
                description: helpData.find((i) => i.id === 'assets')?.shortDescription,
            },
        ],
    },
    {
        action: '',
        label: 'Helse',
        submenu: [
            {
                action: '/hendelseslogg',
                icon: <TasklistSendIcon title="Hendelseslogg" fontSize="1.5rem" />,
                label: 'Hendelseslogg',
                role: 'ROLE_LOG',
                description: helpData.find((i) => i.id === 'hendelseslogg')?.shortDescription,
            },
            {
                action: '/basistest',
                icon: <TerminalIcon title="Basistest" fontSize="1.5rem" />,
                label: 'Basistest',
                role: 'ROLE_LOG',
                description: helpData.find((i) => i.id === 'basistest')?.shortDescription,
            },
            {
                action: '/relasjonstest',
                icon: <ArrowsSquarepathIcon title="Relasjonstest" fontSize="1.5rem" />,
                label: 'Relasjonstest',
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
