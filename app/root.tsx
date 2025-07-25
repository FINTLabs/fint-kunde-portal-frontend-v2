import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useRouteError,
} from '@remix-run/react';
import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { data } from '@remix-run/node';
import './tailwind.css';
import '@navikt/ds-css';
import './novari-theme.css';
import { Alert, Box, Page } from '@navikt/ds-react';
import React from 'react';
import MeApi from '~/api/MeApi';
import Footer from '~/components/Footer';
import FeaturesApi from './api/FeaturesApi';
import { IOrganisation } from '~/types/Organisation';
import { CustomErrorLayout } from '~/components/errors/CustomErrorLayout';
import { HeaderProperties } from './utils/headerProperties';
import logger from '~/utils/logger';
import CustomError from '~/components/errors/CustomError';
import { IMeData } from '~/types/Me';
import { selectOrgCookie } from '~/utils/cookie';
import { IUserSession } from '~/types/Session';
import CustomErrorNoUser from '~/components/errors/CustomErrorNoUser';
import CustomErrorNoOrg from '~/components/errors/CustomErrorNoOrg';
import CustomErrorNoAccess from '~/components/errors/CustomErrorNoAccess';
import { defaultFeatures } from '~/types/FeatureFlag';
import Menu from '~/components/Menu/Menu';

export const links: LinksFunction = () => {
    return [{ rel: 'stylesheet', href: 'https://www.cdnfonts.com/brockmann.font' }];
};

// export const remix_cookie = createCookie('remix_cookie', {
//     maxAge: 604_800, // one week
// });

export const loader = async ({ request }: LoaderFunctionArgs) => {
    HeaderProperties.setProperties(request);

    const meData: IMeData = await MeApi.fetchMe();
    const organisationsData: IOrganisation[] = await MeApi.fetchOrganisations();
    const featuresResponse = await FeaturesApi.fetchFeatures();
    const cookieHeader = request.headers.get('Cookie');
    let cookieValue = await selectOrgCookie.parse(cookieHeader);

    logger.debug(`Cookie value: ${cookieValue}`);
    logger.debug(`count Organisations from me fetch orgs: ${organisationsData.length}`);
    logger.silly(`features: ${JSON.stringify(featuresResponse.data, null, 2)}`);

    let selectedOrganization = organisationsData.find((org) => org.name === cookieValue);
    if (!selectedOrganization) {
        logger.debug(
            `Cookie value "${cookieValue}" did not match any organization. Using the first organization.`
        );
        selectedOrganization = organisationsData[0];
        cookieValue = null;
    }

    const userSession: IUserSession = {
        meData,
        organizationCount: organisationsData.length,
        selectedOrganization,
        organizations: organisationsData,
        features: featuresResponse?.data || defaultFeatures,
    };

    if (!cookieValue) {
        logger.debug(`Creating a new cookie: ${selectedOrganization.name}`);
        const newCookieHeader = await selectOrgCookie.serialize(selectedOrganization.name);
        return data(
            { userSession },
            {
                headers: {
                    'Set-Cookie': newCookieHeader,
                },
            }
        );
    }

    return new Response(JSON.stringify({ userSession }), {
        headers: { 'Content-Type': 'application/json' },
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

    return (
        <Page
            footer={
                <Box padding="1" as="footer" className={'novari-footer'}>
                    <Page.Block gutters width="lg">
                        <Footer />
                    </Page.Block>
                </Box>
            }>
            <Box as="header" className={'novari-header'}>
                <Page.Block gutters width="lg" className={'pt-2 pb-2'}>
                    {/*<div className="flex justify-between">*/}
                    {/*    <MenuLeft userSession={userSession} />*/}
                    {/*    <MenuRight userSession={userSession} />*/}
                    {/*</div>*/}
                    <Menu userSession={userSession} />
                </Page.Block>
            </Box>

            <Box padding="8" paddingBlock="2" as="main">
                <Page.Block gutters width="lg">
                    <Outlet context={userSession} />
                </Page.Block>
            </Box>
        </Page>
    );
}

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
        return (
            <CustomErrorLayout>
                <Alert variant="error">500: Ukjent feil </Alert>
            </CustomErrorLayout>
        );
    }
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const actionType = formData.get('actionType') as string;

    logger.debug('Inside action of root - setting a new org');
    if (actionType === 'UPDATE_SELECTED_ORGANIZATION') {
        const selectedOrganization = formData.get('selectedOrganization') as string;

        const newCookieHeader = await selectOrgCookie.serialize(selectedOrganization);
        logger.debug(`adding a new cookie with org: ${selectedOrganization}`);
        return data(
            { revalidate: true },
            {
                headers: {
                    'Set-Cookie': newCookieHeader,
                },
            }
        );
    }

    return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
