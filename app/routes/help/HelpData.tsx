import type { TFunction } from 'i18next';

export interface HelpDataItem {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
}

const helpIds = [
    'contacts',
    'components',
    'adapter',
    'klienter',
    'assets',
    'basistest',
    'relasjonstest',
    'hendelseslogg',
    'samtykke',
    'status',
    'statusKontrakter',
    'statusHendelser',
] as const;

export function getHelpData(t: TFunction): HelpDataItem[] {
    return helpIds.map((id) => ({
        id,
        title: t(`help.${id}.title`),
        shortDescription: t(`help.${id}.shortDescription`),
        description: t(`help.${id}.description`),
    }));
}
