import en from './locales/en';
import nb from './locales/nb';

export const defaultLanguage = 'nb';

export const supportedLanguages = ['nb', 'en'] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const resources = {
    nb,
    en,
} as const;
