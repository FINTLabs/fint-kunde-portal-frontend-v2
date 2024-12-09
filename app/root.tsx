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
import type {
    ActionFunctionArgs,
    LinksFunction,
    LoaderFunctionArgs,
    MetaFunction,
} from '@remix-run/node';
import { createCookie, json } from '@remix-run/node';
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
import { myCookie } from '~/utils/cookie';
import { MenuLeft } from '~/components/Menu/MenuLeft';
import { MenuRight } from '~/components/Menu/MenuRight';
import { IUserSession } from '~/types/Session';
import CustomErrorNoUser from '~/components/errors/CustomErrorNoUser';
import CustomErrorNoOrg from '~/components/errors/CustomErrorNoOrg';
import CustomErrorNoAccess from '~/components/errors/CustomErrorNoAccess';
import { defaultFeatures } from '~/types/FeatureFlag';

export const meta: MetaFunction = () => {
    return [
        { title: 'Novari Kundeportalen' },
        { name: 'description', content: 'Velkommen til Novari kundeportalen!' },
    ];
};

export const links: LinksFunction = () => {
    return [{ rel: 'stylesheet', href: 'https://www.cdnfonts.com/brockmann.font' }];
};

export const remix_cookie = createCookie('remix_cookie', {
    maxAge: 604_800, // one week
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
    HeaderProperties.setProperties(request);

    const meData: IMeData = await MeApi.fetchMe();
    const organisationsData: IOrganisation[] = await MeApi.fetchOrganisations();
    const featuresResponse = await FeaturesApi.fetchFeatures();
    const cookieHeader = request.headers.get('Cookie');
    const cookieValue = await myCookie.parse(cookieHeader);

    logger.debug(`Cookie value: ${cookieValue}`);
    logger.debug(`features: ${JSON.stringify(featuresResponse.data, null, 2)}`);

    let selectedOrganization =
        organisationsData.find((org) => org.name === cookieValue) || organisationsData[0];

    const userSession: IUserSession = {
        meData,
        organizationCount: organisationsData.length,
        selectedOrganization,
        organizations: organisationsData,
        features: featuresResponse?.data || defaultFeatures,
    };

    if (!cookieValue) {
        const newCookieHeader = await myCookie.serialize(selectedOrganization.name);
        return json(
            { userSession },
            {
                headers: {
                    'Set-Cookie': newCookieHeader,
                },
            }
        );
    }

    logger.info(`USING COOKIE VALUE: ${selectedOrganization.name}`);
    return json({ userSession });
};

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const actionType = formData.get('actionType') as string;

    if (actionType === 'UPDATE_SELECTED_ORGANIZATION') {
        const selectedOrganization = formData.get('selectedOrganization') as string;

        // Update cookie with only the organization name
        const newCookieHeader = await myCookie.serialize(selectedOrganization);
        return json(
            { revalidate: true },
            {
                headers: {
                    'Set-Cookie': newCookieHeader,
                },
            }
        );
    }

    return json({ ok: true });
}

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

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
                    <div className="flex justify-between">
                        <MenuLeft userSession={userSession} />
                        <MenuRight userSession={userSession} />
                    </div>
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
