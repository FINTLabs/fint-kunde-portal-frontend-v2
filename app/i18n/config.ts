import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import {
    defaultLanguage,
    resources,
    type SupportedLanguage,
    supportedLanguages,
} from './resources';

const STORAGE_KEY = 'fint-kundeportal-language';

function isSupportedLanguage(value: string | null): value is SupportedLanguage {
    return !!value && supportedLanguages.includes(value as SupportedLanguage);
}

export function getStoredLanguage(): SupportedLanguage | undefined {
    if (typeof window === 'undefined') {
        return undefined;
    }

    const language = window.localStorage.getItem(STORAGE_KEY);
    return isSupportedLanguage(language) ? language : undefined;
}

if (!i18n.isInitialized) {
    void i18n.use(initReactI18next).init({
        resources,
        lng: defaultLanguage,
        fallbackLng: defaultLanguage,
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });
}

export function setLanguage(language: SupportedLanguage) {
    void i18n.changeLanguage(language);

    if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, language);
    }
}

export default i18n;
