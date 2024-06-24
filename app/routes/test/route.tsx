import {Box, Page} from "@navikt/ds-react";
import {PersonGroupIcon} from "@navikt/aksel-icons";
import {Outlet} from "@remix-run/react";
import Breadcrumbs from "~/components/breadcrumbs";
import InternalHeader from "~/components/InternalHeader";

export default function Index() {
    const breadcrumbs = [
        { name: 'Test Page', link: '/test' },
    ];

    return (

        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalHeader title={"Test with a Kontakter icon"} icon={PersonGroupIcon}/>
            <Box
                // background="surface-alt-4-moderate"
                padding="8"
                paddingBlock="16"
            >
                <Page.Block gutters width="lg">
                    <Outlet />
                </Page.Block>
            </Box>
        </>
    );
}
