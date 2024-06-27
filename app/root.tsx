import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from "@remix-run/react";
import type {LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import "./tailwind.css";
import "@navikt/ds-css";
import "./data-theme.css";
import {Box, Page} from "@navikt/ds-react";
import React from "react";
import Menu from "./components/Menu";
import {getSession, commitSession} from "~/utils/session";
import MeApi from "~/api/MeApi";
import {log} from "~/utils/logger";
import {IMeData, IOrganisations, UserSession} from "~/api/types";
import Footer from "~/components/Footer";

export const meta: MetaFunction = () => {
    return [
        {title: "Novari Kunde Portalen"},
        {name: "description", content: "Welcome to the kundeportalen!"},
    ];
};

export const loader = async ({request}: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get("Cookie"));

    if (!session.has("user-session")) {
        const meData: IMeData = await MeApi.fetchMe();
        const organisationsData: IOrganisations[] = await MeApi.fetchOrganisations();

        const organizationDetails = organisationsData.map(org => ({
            name: org.name,
            orgNumber: org.orgNumber,
            displayName: org.displayName,
        }));

        const userSession: UserSession = {
            firstName: meData.firstName,
            lastName: meData.lastName,
            organizationCount: organisationsData.length,
            selectedOrganization: organizationDetails[0],
            organizations: organizationDetails,
        };

        session.set("user-session", userSession);

        const cookie = await commitSession(session);
        log("cookie", cookie);
        log("user-session", session.get("user-session"));

        return json(
            {meData, organizationsData: organisationsData},
            {
                headers: {
                    "Set-Cookie": cookie,
                },
            }
        );
    }

    log("user-session", session.get("user-session"));
    return json({userSession: session.get("user-session")});
};

export function Layout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <Meta/>
            <Links/>
        </head>
        <body data-theme="light">
        <Page
            footer={
                <Box background="surface-neutral-moderate" padding="8" as="footer">
                    <Page.Block gutters width="lg">
                        <Footer />
                    </Page.Block>
                </Box>
            }
        >
            <Box background="surface-neutral-moderate" padding="8" as="header">
                <Page.Block gutters width="lg">
                    <Menu/>
                </Page.Block>
            </Box>
            <Box
                // background="surface-alt-3-moderate"
                padding="8"
                paddingBlock="16"
                as="main"
            >
                <Page.Block gutters width="lg">
                    {children}
                </Page.Block>
            </Box>
        </Page>

        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    );
}

export default function App() {
    const {userSession} = useLoaderData<{ userSession: UserSession }>();
    log("userSession - app function", userSession)
    return (

        <Outlet context={userSession}/>

    );
}
