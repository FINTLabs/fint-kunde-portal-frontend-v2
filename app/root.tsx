import { Box, Page } from '@navikt/ds-react';
import { NovariFooter, NovariHeader } from 'novari-frontend-components';
import React from 'react';
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
} from 'react-router';

import MeApi from '~/api/MeApi';
import CustomError from '~/components/errors/CustomError';
import { CustomErrorLayout } from '~/components/errors/CustomErrorLayout';
import CustomErrorNoAccess from '~/components/errors/CustomErrorNoAccess';
import CustomErrorNoOrg from '~/components/errors/CustomErrorNoOrg';
import CustomErrorNoUser from '~/components/errors/CustomErrorNoUser';
import { footerLinks, novariMenu } from '~/components/Menu/MenuConfig';
import { UserOrganization } from '~/components/Menu/UserOrganization';
import { defaultFeatures } from '~/types/FeatureFlag';
import { IMeData } from '~/types/Me';
import { IOrganisation } from '~/types/Organisation';
import { IUserSession } from '~/types/Session';
import { selectOrgCookie } from '~/utils/cookie';
import FeaturesApi from './api/FeaturesApi';
import { HeaderProperties } from './utils/headerProperties';
import { cspReportOnly } from '~/utils/csp';
import { useTrackAnalyticsPageViews } from '~/hooks/useTrackAnalyticsPageViews';
import appStylesHref from './styles/app.css?url';
import akselHref from '@navikt/ds-css?url';

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: akselHref },
    { rel: 'stylesheet', href: appStylesHref },
];
export const loader = async ({ request }: LoaderFunctionArgs) => {
    HeaderProperties.setProperties(request);

    const meData: IMeData = await MeApi.fetchMe();

    HeaderProperties.setUsername(`${meData.firstName} ${meData.lastName}`.trim());
    const organisationsData: IOrganisation[] = await MeApi.fetchOrganisations();
    const featuresResponse = await FeaturesApi.fetchFeatures();

    const cookieHeader = request.headers.get('Cookie');
    let cookieValue = await selectOrgCookie.parse(cookieHeader);

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
            { userSession },
            {
                headers: {
                    'Set-Cookie': newCookieHeader,
                    'Content-Security-Policy-Report-Only': cspReportOnly,
                },
            }
        );
    }

    return new Response(JSON.stringify({ userSession }), {
        headers: {
            'Content-Type': 'application/json',
            'Content-Security-Policy-Report-Only': cspReportOnly,
        },
    });
};

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                <Meta />
                <Links />
                <title>FINT Kundeportal</title>
            </head>
            <body data-theme="novari">
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    const { userSession } = useLoaderData<{
        userSession: IUserSession;
    }>();
    useTrackAnalyticsPageViews(userSession.selectedOrganization.name);

    const navigate = useNavigate();

    function onLogin(): void {
        throw new Error('Function not implemented.');
    }

    return (
        <Page
            footer={
                <Box padding="space-2" as="footer" className={'novari-footer'}>
                    <Page.Block gutters width="lg">
                        <NovariFooter links={footerLinks} />
                    </Page.Block>
                </Box>
            }>
            <Box className={'novari-header'} as="nav" data-cy="novari-header" shadow="dialog">
                <NovariHeader
                    isLoggedIn={true}
                    // appName={'FINT Kunde Portal'}
                    menu={novariMenu}
                    showLogoWithTitle={true}
                    displayName={userSession.meData.firstName || 'Logged In'}
                    onLogout={() =>
                        (window.location.href = 'https://idp.felleskomponent.no/nidp/app/logout')
                    }
                    onMenuClick={(action) => navigate(action)}
                    appName={'FINT Kundeportal'}
                    onLogin={onLogin}>
                    <UserOrganization userSession={userSession} />
                </NovariHeader>
            </Box>

            {/*<Box padding="space-8" paddingBlock="space-2" as="main">*/}
            <Page.Block as="main" width="xl" gutters>
                <Outlet context={userSession} />
            </Page.Block>
            {/*</Box>*/}
        </Page>
    );
}

//TODO: Add tenant to analytic tracking if logged in!!
export function ErrorBoundary() {
    const error = useRouteError();

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
                <CustomErrorLayout>
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
                    errorData={error.data}
                    statusTitle={error.statusText}
                />
            </CustomErrorLayout>
        );
    } else {
        // Handle unexpected errors (like API fetch failures)
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
