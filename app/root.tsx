import { ActionMenu, Box, Button, Link, Page, Theme as AkselTheme } from '@navikt/ds-react';
import { NovariFooter, NovariHeader, ThemeProvider, useTheme } from 'novari-frontend-components';
import React, { useEffect, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import {
    type ActionFunctionArgs,
    data,
    isRouteErrorResponse,
    Links,
    type LinksFunction,
    type LoaderFunctionArgs,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useNavigate,
    useRouteError,
    useRouteLoaderData,
} from 'react-router';

import MeApi from '~/api/MeApi';
import CustomError from '~/components/errors/CustomError';
import { CustomErrorLayout } from '~/components/errors/CustomErrorLayout';
import CustomErrorNoAccess from '~/components/errors/CustomErrorNoAccess';
import CustomErrorNoOrg from '~/components/errors/CustomErrorNoOrg';
import CustomErrorNoUser from '~/components/errors/CustomErrorNoUser';
import { getFooterLinks, getNovariMenu } from '~/components/Menu/MenuConfig';
import { UserOrganization } from '~/components/Menu/UserOrganization';
import { setLanguage } from '~/i18n/config';
import { type SupportedLanguage, supportedLanguages } from '~/i18n/resources';
import { defaultFeatures } from '~/types/FeatureFlag';
import { IMeData } from '~/types/Me';
import { IOrganisation } from '~/types/Organisation';
import { IUserSession } from '~/types/Session';
import {
    parseTheme,
    selectOrgCookie,
    THEME_STORAGE_KEY,
    themeCookie,
    type ThemeName,
} from '~/utils/cookie';
import FeaturesApi from './api/FeaturesApi';
import { HeaderProperties } from './utils/headerProperties';
import { cspReportOnly } from '~/utils/csp';
import { useTrackAnalyticsPageViews } from '~/hooks/useTrackAnalyticsPageViews';
import appStylesHref from './styles/app.css?url';
import akselHref from '@navikt/ds-css?url';
import { LanguageIcon, PersonCircleIcon } from '@navikt/aksel-icons';
import AnalyticsApi from '~/api/AnalyticsApi';

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: akselHref },
    { rel: 'stylesheet', href: appStylesHref },
];

export function headers({ loaderHeaders }: { loaderHeaders: Headers }) {
    return {
        'Content-Security-Policy-Report-Only':
            loaderHeaders.get('Content-Security-Policy-Report-Only') ?? cspReportOnly,
    };
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    HeaderProperties.setProperties(request);

    const cookieHeader = request.headers.get('Cookie');
    let cookieValue = await selectOrgCookie.parse(cookieHeader);
    const theme = parseTheme(await themeCookie.parse(cookieHeader));
    const hasLoginCookie = Boolean(cookieValue);
    let meData: IMeData;

    try {
        meData = await MeApi.fetchMe();
    } catch (error) {
        if (error instanceof Response) {
            const message = await error.text();
            throw data(
                { message, hasLoginCookie, source: 'me' },
                {
                    status: error.status,
                    statusText: error.statusText,
                }
            );
        }
        throw error;
    }

    HeaderProperties.setUsername(`${meData.firstName} ${meData.lastName}`.trim());
    const organisationsData: IOrganisation[] = await MeApi.fetchOrganisations();
    const featuresResponse = await FeaturesApi.fetchFeatures();

    let selectedOrganization = organisationsData.find((org) => org.name === cookieValue);
    if (!selectedOrganization) {
        selectedOrganization = organisationsData[0];
        cookieValue = null;
    }

    const userSession: IUserSession = {
        meData,
        organizationCount: organisationsData.length,
        selectedOrganization,
        organizations: organisationsData,
        features: featuresResponse?.data || defaultFeatures,
        selectedEnv: 'beta',
    };

    if (!cookieValue) {
        const newCookieHeader = await selectOrgCookie.serialize(selectedOrganization.name);
        return data(
            { userSession, theme },
            {
                headers: {
                    'Set-Cookie': newCookieHeader,
                    'Content-Security-Policy-Report-Only': cspReportOnly,
                },
            }
        );
    }

    return new Response(JSON.stringify({ userSession, theme }), {
        headers: {
            'Content-Type': 'application/json',
            'Content-Security-Policy-Report-Only': cspReportOnly,
        },
    });
};

const hydrateSubscribe = () => () => {};
const getHydrateSnapshot = () => true;
const getHydrateServerSnapshot = () => false;

function useHydrated() {
    return useSyncExternalStore(hydrateSubscribe, getHydrateSnapshot, getHydrateServerSnapshot);
}

function ThemeCookieSync() {
    const { theme } = useTheme();

    useEffect(() => {
        void themeCookie.serialize(theme).then((serialized) => {
            document.cookie = serialized;
        });
    }, [theme]);

    return null;
}

function AppTheme({ children, ssrTheme }: { children: React.ReactNode; ssrTheme: ThemeName }) {
    const { theme } = useTheme();
    const hydrated = useHydrated();

    return (
        <AkselTheme theme={hydrated ? theme : ssrTheme} className="novari-theme" hasBackground>
            {children}
        </AkselTheme>
    );
}

type RootLoaderData = {
    userSession?: IUserSession;
    theme?: ThemeName;
};

export function Layout({ children }: { children: React.ReactNode }) {
    const { t, i18n } = useTranslation();
    const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
    const ssrTheme = rootData?.theme ?? 'light';

    return (
        <html lang={i18n.resolvedLanguage || i18n.language || 'nb'} suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                <Meta />
                <Links />
                <title>{t('root.title')}</title>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='dark'||t==='light'){document.documentElement.classList.add(t);}}catch(e){}})();`,
                    }}
                />
            </head>
            <body>
                <ThemeProvider defaultTheme={ssrTheme} storageKey={THEME_STORAGE_KEY}>
                    <ThemeCookieSync />
                    <AppTheme ssrTheme={ssrTheme}>{children}</AppTheme>
                </ThemeProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    const { t, i18n } = useTranslation();
    const themeHydrated = useHydrated();
    const { userSession } = useLoaderData<{
        userSession: IUserSession;
        theme: ThemeName;
    }>();
    useTrackAnalyticsPageViews(userSession.selectedOrganization.name);

    const navigate = useNavigate();

    function onLogin(): void {
        throw new Error('Function not implemented.');
    }

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const language = window.localStorage.getItem('fint-kundeportal-language');
        const storedLanguage = supportedLanguages.includes(language as SupportedLanguage)
            ? (language as SupportedLanguage)
            : undefined;
        if (storedLanguage && storedLanguage !== i18n.resolvedLanguage) {
            setLanguage(storedLanguage);
            void AnalyticsApi.trackButtonClick(
                'change-language-button',
                '/',
                userSession?.selectedOrganization?.name,
                { setLanguage: i18n.resolvedLanguage }
            );
        }
    }, [i18n.resolvedLanguage, userSession?.selectedOrganization?.name]);

    const menu = getNovariMenu(t);
    const footerLinks = getFooterLinks(t);
    const selectedLanguage = (i18n.resolvedLanguage || i18n.language || 'nb') as SupportedLanguage;

    //TODO: Add language selector to novari-components
    return (
        <Page
            footer={
                <Box padding="space-2" as="footer" className={'novari-footer'}>
                    <Page.Block gutters width="lg">
                        <NovariFooter links={footerLinks} showThemeSwitcher={themeHydrated} />
                    </Page.Block>
                </Box>
            }
        >
            <Box className={'novari-header'} as="nav" data-cy="novari-header" shadow="dialog">
                <NovariHeader
                    isLoggedIn={true}
                    // appName={'FINT Kunde Portal'}
                    menu={menu}
                    showLogoWithTitle={true}
                    displayName={userSession.meData.firstName || 'Logged In'}
                    onLogout={() =>
                        (window.location.href = 'https://idp.felleskomponent.no/nidp/app/logout')
                    }
                    onMenuClick={(action) => navigate(action)}
                    appName={t('root.appName')}
                    onLogin={onLogin}
                >
                    <UserOrganization userSession={userSession} />

                    <ActionMenu>
                        <ActionMenu.Trigger>
                            <Button
                                size="small"
                                variant="tertiary"
                                icon={<LanguageIcon aria-hidden />}
                                aria-label={t('language.label')}
                                className="novari-header-icon"
                            >
                                {t(`language.${selectedLanguage}`)}
                            </Button>
                        </ActionMenu.Trigger>
                        <ActionMenu.Content>
                            {supportedLanguages.map((language) => (
                                <ActionMenu.Item
                                    key={language}
                                    onSelect={() => setLanguage(language as SupportedLanguage)}
                                >
                                    {t(`language.${language}`)}
                                </ActionMenu.Item>
                            ))}
                        </ActionMenu.Content>
                    </ActionMenu>

                    <Link href={'/user'}>
                        <PersonCircleIcon
                            title={t('root.userIconTitle')}
                            fontSize="1.5rem"
                            className="novari-header-icon"
                        />
                    </Link>
                </NovariHeader>
            </Box>

            <Page.Block as="main" width="xl" gutters>
                <Outlet context={userSession} />
            </Page.Block>
        </Page>
    );
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const actionType = formData.get('actionType') as string;

    if (actionType === 'UPDATE_SELECTED_ORGANIZATION') {
        const selectedOrganization = formData.get('selectedOrganization') as string;

        const newCookieHeader = await selectOrgCookie.serialize(selectedOrganization);
        return data(
            { revalidate: true },
            {
                headers: {
                    'Set-Cookie': newCookieHeader,
                    'Content-Security-Policy-Report-Only': cspReportOnly,
                },
            }
        );
    }

    return new Response(JSON.stringify({ ok: true }), {
        headers: {
            'Content-Type': 'application/json',
            'Content-Security-Policy-Report-Only': cspReportOnly,
        },
    });
}

export function ErrorBoundary() {
    const error = useRouteError();
    const hasLoginCookie =
        isRouteErrorResponse(error) &&
        typeof error.data === 'object' &&
        error.data !== null &&
        'hasLoginCookie' in error.data
            ? Boolean(error.data.hasLoginCookie)
            : false;
    const isMeError =
        isRouteErrorResponse(error) &&
        typeof error.data === 'object' &&
        error.data !== null &&
        'source' in error.data &&
        error.data.source === 'me';

    if (isRouteErrorResponse(error)) {
        // Handle a 404 from me - special case
        if (error.status === 406) {
            return (
                <CustomErrorLayout>
                    <CustomErrorNoUser />
                </CustomErrorLayout>
            );
        } else if (error.status === 401) {
            return (
                <CustomErrorLayout showMenu={isMeError ? false : hasLoginCookie}>
                    <CustomErrorNoOrg />
                </CustomErrorLayout>
            );
        } else if (error.status === 403) {
            return (
                <CustomErrorLayout>
                    <CustomErrorNoAccess />
                </CustomErrorLayout>
            );
        }
        return (
            <CustomErrorLayout>
                <CustomError
                    statusCode={error.status}
                    errorData={
                        typeof error.data === 'object' &&
                        error.data !== null &&
                        'message' in error.data
                            ? error.data.message
                            : error.data
                    }
                    statusTitle={error.statusText}
                />
            </CustomErrorLayout>
        );
    } else {
        // Handle unexpected linkwalker.$type._errors (like API fetch failures)
        const errorMessage = error instanceof Error ? error.message : 'Ukjent feil';

        return (
            <CustomErrorLayout>
                <CustomError
                    statusCode={500}
                    errorData={errorMessage}
                    statusTitle="Noe gikk galt"
                />
            </CustomErrorLayout>
        );
    }
}
