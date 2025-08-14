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
import { MenuGroup } from '~/types/MenuItem';
import { helpData } from '~/routes/help/HelpData';

export const footerLinks = [
    { label: 'Driftsmeldinger', href: 'https://novari.no/driftsmeldinger/' },
    { label: 'Opprett supportsak', href: 'http://support.novari.no' },
    { label: 'Brukerhjelp', href: 'http://fintlabs.no' },
    { label: 'Ordliste', href: '/help/' },
    { label: 'FINT Test Client', href: 'https://api.felleskomponent.no/' },
];

export const menuConfig: MenuGroup[] = [
    {
        label: 'TILGANGER',
        items: [
            {
                label: 'Kontakter',
                action: '/kontakter',
                icon: <PersonGroupIcon title="Kontakter" fontSize="1.5rem" />,
                description: helpData.find((i) => i.id === 'contacts')?.shortDescription,
                role: 'ROLE_ORGANISATION',
            },
            {
                label: 'Komponenter',
                action: '/komponenter',
                icon: <ComponentIcon title="Komponenter" fontSize="1.5rem" />,
                description: helpData.find((i) => i.id === 'components')?.shortDescription,
                role: 'ROLE_COMPONENT',
            },
            {
                label: 'Adaptere',
                action: '/adaptere',
                icon: <MigrationIcon title={'Adaptere'} fontSize="1.5rem" />,
                description: helpData.find((i) => i.id === 'adapter')?.shortDescription,
                role: 'ROLE_ADAPTER',
            },
            {
                label: 'Klienter',
                action: '/klienter',
                icon: <TokenIcon title={'Klienter'} fontSize="1.5rem" />,
                description: helpData.find((i) => i.id === 'klienter')?.shortDescription,
                role: 'ROLE_CLIENT',
            },
            {
                label: 'Ressurser',
                action: '/ressurser',
                icon: <LayersIcon title={'Ressurser'} fontSize="1.5rem" />,
                description: helpData.find((i) => i.id === 'assets')?.shortDescription,
                role: 'ROLE_ASSET',
            },
        ],
    },
    {
        label: 'HELSE',
        items: [
            {
                label: 'Hendelseslogg',
                action: '/hendelseslogg',
                icon: <TasklistSendIcon title={'Hendelseslogg'} fontSize="1.5rem" />,
                description: helpData.find((i) => i.id === 'hendelseslogg')?.shortDescription,
                role: 'ROLE_LOG',
            },
            {
                label: 'Basistest',
                action: '/basistest',
                icon: <TerminalIcon title={'Basistest'} fontSize="1.5rem" />,
                description: helpData.find((i) => i.id === 'basistest')?.shortDescription,
                role: 'ROLE_LOG',
            },
            {
                label: 'Relasjonstest',
                action: '/relasjonstest',
                icon: <ArrowsSquarepathIcon title={'Relasjonstest'} fontSize="1.5rem" />,
                description: helpData.find((i) => i.id === 'relasjonstest')?.shortDescription,
                role: 'ROLE_LOG',
            },
        ],
    },
];
