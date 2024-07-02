import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import './tailwind.css';
import '@navikt/ds-css';
import './data-theme.css';
import { Box, Page } from '@navikt/ds-react';
import React from 'react';
import Menu from './components/Menu/Menu';
import { getSession, commitSession } from '~/utils/session';
import MeApi from '~/api/MeApi';
import { log } from '~/utils/logger';
import { FeatureFlags, IMeData,  UserSession } from '~/types/types';
import Footer from '~/components/Footer';
import FeaturesApi from './api/FeaturesApi';
import {IOrganisation} from "~/types/IOrganisation";

export const meta: MetaFunction = () => {
    return [
        { title: 'Novari Kunde Portalen' },
        { name: 'description', content: 'Welcome to the kundeportalen!' },
    ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get('Cookie'));

    let userSession = session.get('user-session');
    if (!userSession) {
        const meData: IMeData = await MeApi.fetchMe();
        const organisationsData: IOrganisation[] = await MeApi.fetchOrganisations();

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

        session.set('user-session', userSession);

        const cookie = await commitSession(session);
        log('cookie', cookie);
        log('user-session', userSession);

        return json(
            { userSession, features: {} }, // Ensure features is defined even if empty
            {
                headers: {
                    'Set-Cookie': cookie,
                },
            }
        );
    }

    log('user-session', userSession);

    const features = await FeaturesApi.fetchFeatures();
    log('features', features);

    return json({ userSession, features });
};

export function Layout({ children }: { children: React.ReactNode }) {
    const loaderData = useLoaderData<{
        userSession: UserSession;
        features: FeatureFlags;
    }>();

    const userSession = loaderData?.userSession;
    const features = loaderData?.features;

    if (!userSession) {
        return <div>Usersession is undefined</div>;
    }

    const displaySamtykke = features ? features['samtykke-admin-new'] : false;
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body data-theme="light">
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
                            <Menu userSession={userSession} displaySamtykke={displaySamtykke} />
                        </Page.Block>
                    </Box>
                    <Box
                        // background="surface-alt-3-moderate"
                        padding="8"
                        paddingBlock="16"
                        as="main">
                        <Page.Block gutters width="lg">
                            {children}
                        </Page.Block>
                    </Box>
                </Page>

                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    const loaderData = useLoaderData<{ userSession: UserSession }>();
    const userSession = loaderData?.userSession;

    if (!userSession) {
        return <div>Loading...</div>;
    }

    log('userSession - app function', userSession);
    return <Outlet context={userSession} />;
}
