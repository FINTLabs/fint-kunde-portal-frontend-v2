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
import Menu from './components/Menu/Menu';
import { commitSession, getSession } from '~/utils/session';
import MeApi from '~/api/MeApi';
import Footer from '~/components/Footer';
import FeaturesApi from './api/FeaturesApi';
import { Organisation } from '~/types/Organisation';
import { CustomErrorLayout } from '~/components/errors/CustomErrorLayout';
import { getFormData } from './utils/requestUtils';
import { getUserSession, setUserSession } from './utils/selectedOrganization';
import { HeaderProperties } from './utils/headerProperties';
import logger from '~/utils/logger';
import CustomError from '~/components/errors/CustomError';
import { IMeData } from '~/types/Me';
import { IUserSession, SessionOrganisation } from '~/types/Session';
import { FeatureFlags } from '~/types/FeatureFlag';
import { parseCookie } from '~/utils/ParseCookie';

export const meta: MetaFunction = () => {
    return [
        { title: 'Novari Kundeportalen' },
        { name: 'description', content: 'Welcome to the kundeportalen!' },
    ];
};

export const links: LinksFunction = () => {
    return [{ rel: 'stylesheet', href: 'https://www.cdnfonts.com/brockmann.font' }];
};

export const remix_cookie = createCookie('remix_cookie', {
    maxAge: 604_800, // one week
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
    let userSession = await getUserSession(request);
    HeaderProperties.setProperties(request); // root is called on every request, makes sense to set xnin only once here.
    const meData: IMeData = await MeApi.fetchMe(); //Should we do this so often? otherwise it will require a logout to change

    if (!userSession) {
        const organisationsData: Organisation[] = await MeApi.fetchOrganisations();

        const organizationDetails = organisationsData.map((org) => ({
            name: org.name,
            orgNumber: org.orgNumber,
            displayName: org.displayName,
        }));

        // Get the selected organization from the persistent cookie, if available
        const cookies = parseCookie(request.headers.get('Cookie'));
        const selectedOrganizationFromCookie = cookies['selectedOrganization'];

        let selectedOrganization = organizationDetails[0];
        if (selectedOrganizationFromCookie) {
            selectedOrganization =
                organizationDetails.find(
                    (org) => org.orgNumber === selectedOrganizationFromCookie
                ) || organizationDetails[0];
        }

        userSession = {
            firstName: meData.firstName,
            lastName: meData.lastName,
            organizationCount: organisationsData.length,
            selectedOrganization,
            organizations: organizationDetails,
        };

        const session = await setUserSession(request, userSession);
        const cookie = await commitSession(session);
        let features = await FeaturesApi.fetchFeatures();

        features = features ? features : {};

        return json(
            { userSession, features }, // Ensure features is defined
            {
                headers: {
                    'Set-Cookie': cookie,
                },
            }
        );
    }

    const features = await FeaturesApi.fetchFeatures();
    const roles = meData.roles;

    return json({ userSession, features, roles });
};

export async function action({ request }: ActionFunctionArgs) {
    const actionName = 'Action Update';
    const formData = await request.formData();
    const actionType = getFormData(formData.get('actionType'), 'actionType', actionName);

    logger.debug('Updating user org in action');
    if (actionType === 'UPDATE_SELECTED_ORGANIZATION') {
        const selectedOrganization = getFormData(
            formData.get('selectedOrganization'),
            'selectedOrganization',
            actionName
        );

        const sessionString = request.url.includes('localhost') ? 'user-session' : 'user_session';
        const session = await getSession(request.headers.get('Cookie'));
        const userSession = session.get(sessionString);
        userSession.selectedOrganization = userSession.organizations.find(
            (org: SessionOrganisation) => org.displayName === selectedOrganization
        );

        session.set(sessionString, userSession);
        const cookie = await commitSession(session);
        return json(
            { userSession },
            {
                headers: {
                    'Set-Cookie': cookie,
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
    const loaderData = useLoaderData<{
        userSession: IUserSession;
        features: FeatureFlags;
        // roles: string[];
    }>();
    const userSession = loaderData?.userSession;
    // const roles = loaderData?.roles;
    // const features = loaderData?.features;

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
                    <Menu
                        userSession={userSession}
                        // displaySamtykke={features['samtykke-admin-new']}
                    />
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
                <Alert variant="error">Ukjent feil</Alert>
            </CustomErrorLayout>
        );
    }
}
