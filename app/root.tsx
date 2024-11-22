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
import { getFormData } from './utils/requestUtils';
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

    if (meData.nin && meData.technical.length > 0) {
        const organisationsData: IOrganisation[] = await MeApi.fetchOrganisations();
        const features = await FeaturesApi.fetchFeatures('in root');

        console.log(features);

        const cookieHeader = request.headers.get('Cookie');
        const cookieValue = await myCookie.parse(cookieHeader);

        logger.debug(`Cookie value: ${cookieValue}`);

        let selectedOrganization =
            cookieValue && organisationsData.find((org) => org.name === cookieValue);

        const userSession: IUserSession = {
            meData: meData,
            organizationCount: organisationsData.length,
            selectedOrganization: selectedOrganization,
            organizations: organisationsData,
            features: features,
        };

        logger.info(
            `List of organization names: ${organisationsData.map((org) => org.name).join(', ')}`
        );

        if (!selectedOrganization) {
            selectedOrganization = organisationsData[0];
            const newCookieHeader = await myCookie.serialize(selectedOrganization.name);
            userSession.selectedOrganization = selectedOrganization;

            return json(
                { userSession },
                {
                    headers: {
                        'Set-Cookie': newCookieHeader,
                    },
                }
            );
        } else {
            logger.info(`USING COOKIE VALUE: ${selectedOrganization.name}`);
            return json({ userSession });
        }
    } else {
        const message =
            'Du er ikke tilknyttet en organisasjon. Gå til FINT administratoren i organisasjonen din for å få tilgang.';
        throw new Response('errorMessage', {
            status: 401,
            statusText: message,
        });
    }
};

export async function action({ request }: ActionFunctionArgs) {
    const actionName = 'Action Update';
    const formData = await request.formData();
    const actionType = getFormData(formData.get('actionType'), 'actionType', actionName);

    if (actionType === 'UPDATE_SELECTED_ORGANIZATION') {
        const selectedOrganization = getFormData(
            formData.get('selectedOrganization'),
            'selectedOrganization',
            actionName
        );

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
        // Custom handling for specific status codes
        if (error.status === 403) {
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
