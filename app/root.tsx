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
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { createCookie, json } from '@remix-run/node'; // or cloudflare/deno
import './tailwind.css';
import '@navikt/ds-css';
import './novari-theme.css';
import { BodyShort, Box, Heading, Page } from '@navikt/ds-react';
import React from 'react';
import Menu from './components/Menu/Menu';
import { commitSession, getSession } from '~/utils/session';
import MeApi from '~/api/MeApi';
import { FeatureFlags, IMeData, IUserSession, SessionOrganisation } from '~/types/types';
import Footer from '~/components/Footer';
import FeaturesApi from './api/FeaturesApi';
import { Organisation } from '~/types/Organisation';
import { CustomError } from '~/components/shared/CustomError';
import { debug, info, log } from './utils/logger';
import { getFormData } from './utils/requestUtils';
import { getUserSession, setUserSession } from './utils/selectedOrganization';
import { Utility } from './utils/utility';

export const meta: MetaFunction = () => {
    return [
        { title: 'Novari Kundeportalen' },
        { name: 'description', content: 'Welcome to the kundeportalen!' },
    ];
};

export const remix_cookie = createCookie('remix_cookie', {
    maxAge: 604_800, // one week
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
    log('Calling loader in root.tsx');
    let userSession = await getUserSession(request);
    Utility.setXnin(request); // root is called on every request, makes sense to set xnin only once here.

    if (!userSession) {
        const meData: IMeData = await MeApi.fetchMe();
        log('meData: ', meData);
        const organisationsData: Organisation[] = await MeApi.fetchOrganisations();

        const organizationDetails = organisationsData.map((org) => ({
            name: org.name,
            orgNumber: org.orgNumber,
            displayName: org.displayName,
        }));

        userSession = {
            firstName: meData.firstName,
            lastName: meData.lastName,
            organizationCount: organisationsData.length,
            selectedOrganization: organizationDetails[0],
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
    debug('Userorganization:', userSession?.selectedOrganization?.displayName);
    // log('--------features', features);
    return json({ userSession, features });
};

export async function action({ request }: ActionFunctionArgs) {
    const actionName = 'Action Update';
    const formData = await request.formData();
    const actionType = getFormData(formData.get('actionType'), 'actionType', actionName);

    info('Updating user org in action');
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
    const loaderData = useLoaderData<{ userSession: IUserSession; features: FeatureFlags }>();
    const userSession = loaderData?.userSession;
    const features = loaderData?.features;

    return (
        <Page
            footer={
                <Box background="bg-subtle" padding="1" as="footer">
                    <Page.Block gutters width="lg">
                        <Footer />
                    </Page.Block>
                </Box>
            }>
            <Box background="bg-subtle" as="header">
                <Page.Block gutters width="lg">
                    <Menu
                        userSession={userSession}
                        displaySamtykke={features['samtykke-admin-new']}
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
            <CustomError>
                <Heading size="medium" spacing>
                    {error.status} {error.statusText}
                </Heading>
                <Box padding="8" borderColor="border-danger" borderWidth="4" borderRadius={'large'}>
                    <BodyShort>{error.data}</BodyShort>
                </Box>
            </CustomError>
        );
    } else if (error instanceof Error) {
        return (
            <CustomError>
                <h1>Error</h1>
                <p>{error.message}</p>
                <p>The stack trace is:</p>
                <p>
                    <pre className="overflow-auto whitespace-pre-wrap break-words max-w-full p-4 bg-gray-100 border border-gray-300 rounded-md">
                        {error.stack}
                    </pre>
                </p>
            </CustomError>
        );
    } else {
        return <h1>Unknown Error</h1>;
    }
}

// function getCookieValue(cookieString: string, key: string): string | null {
//     const keyValuePairs = cookieString.split('; ');
//     for (const pair of keyValuePairs) {
//         const [cookieKey, cookieValue] = pair.split('=');
//         if (cookieKey === key) {
//             return decodeURIComponent(cookieValue);
//         }
//     }
//     return null;
// }
