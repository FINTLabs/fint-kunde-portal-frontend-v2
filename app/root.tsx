import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import './tailwind.css';
import '@navikt/ds-css';
import './data-theme.css';
import { Box, Page } from '@navikt/ds-react';
import React from 'react';
import Menu from './components/Menu/Menu';
import { getSession, commitSession } from '~/utils/session';
import MeApi from '~/api/MeApi';
import { FeatureFlags, IMeData, IUserSession, SessionOrganisation } from '~/types/types';
import Footer from '~/components/Footer';
import FeaturesApi from './api/FeaturesApi';
import { Organisation } from '~/types/Organisation';
import { CustomError } from '~/components/shared/CustomError';
import { log } from './utils/logger';
import { getFormData } from './utils/requestUtils';
import { createCookie } from '@remix-run/node'; // or cloudflare/deno
import { getSessionFromCookie, getUserSession, setUserSession } from './utils/selectedOrganization';

export const meta: MetaFunction = () => {
    return [
        { title: 'Novari Kunde Portalen' },
        { name: 'description', content: 'Welcome to the kundeportalen!' },
    ];
};

export const remix_cookie = createCookie('remix_cookie', {
    maxAge: 604_800, // one week
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
    log('Calling loader in root.tsx');

    let userSession = await getUserSession(request);
    // log('userSessionFromGetSession ', userSession);
    // let userSession = session.get('user_session');

    const cookieHeader = request.headers.get('Cookie'); // to get user_session set by SSO (middleware between user and remix app)
    // log('cookieHeader in loader', cookieHeader);
    // const cookieObj = await remix_cookie.parse(cookieHeader); // this is NULL - WHY????

    // log('cookieOBJXT', cookieObj);

    // const user_session = getCookieValue(cookieHeader || '', 'user_session'); // getting cookie value manually
    // console.log(user_session);

    // log('userSession: ', userSession);
    if (!userSession) {
        const meData: IMeData = await MeApi.fetchMe(cookieHeader || '');
        console.log('meData: ', meData);
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
        // const session = await getSessionFromCookie(request);
        // session.set('user_session', userSession);
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
    log('Userorganization  |', userSession?.selectedOrganization?.displayName);
    return json({ userSession, features });

    // return json({ cookieHeader, cookie: cookieObj, userSession: userSession });
};

export async function action({ request }: ActionFunctionArgs) {
    const actionName = 'Action Update';
    const formData = await request.formData();
    const actionType = getFormData(formData.get('actionType'), 'actionType', actionName);

    console.log('Updating user org in action');
    if (actionType === 'UPDATE_SELECTED_ORGANIZATION') {
        const selectedOrganization = getFormData(
            formData.get('selectedOrganization'),
            'selectedOrganization',
            actionName
        );

        const sessionString = request.url.includes('localhost') ? 'user-session' : 'user_session';
        const session = await getSession(request.headers.get('Cookie'));
        let userSession = session.get(sessionString);
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
            <body data-theme="light">
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    const loaderData = useLoaderData<{ userSession: IUserSession; features: FeatureFlags }>();
    // const { cookieHeader, cookie, userSession } = useLoaderData<typeof loader>();
    const userSession = loaderData?.userSession;
    const features = loaderData?.features;

    // console.log('cookieHeader');
    // console.log(cookieHeader);
    // console.log('cookie');
    // console.log(cookie);
    // console.log('userSessionFromHeader');
    // console.log(userSession);

    // return <div>Cookies:</div>;
    return (
        <Page
            footer={
                <Box background="surface-neutral-moderate" padding="8" as="footer">
                    <Page.Block gutters width="lg">
                        <Footer />
                    </Page.Block>
                </Box>
            }>
            <Box background="surface-neutral-moderate" padding="8" as="header">
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
export function ErrorBoundary({ error }: { error: Error }) {
    //TODO: can we make the message show?? need an error layout

    return (
        // <>
        //     <p>Something went wrong !</p>
        //     <p>{error?.message}</p>
        // </>
        <CustomError error={error} />
    );
}
function getCookieValue(cookieString: string, key: string): string | null {
    const keyValuePairs = cookieString.split('; ');
    for (const pair of keyValuePairs) {
        const [cookieKey, cookieValue] = pair.split('=');
        if (cookieKey === key) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}
