import InternalPageHeader from "~/components/shared/InternalPageHeader";
import {TokenIcon} from "@navikt/aksel-icons";
import React from "react";
import {Outlet} from "@remix-run/react";
import Breadcrumbs from "~/components/shared/breadcrumbs";

export default function Index() {
    const breadcrumbs = [{ name: 'Klienter', link: '/klienter' }];

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
            <InternalPageHeader
                title={'Klienter'}
                icon={TokenIcon}
                helpText="klienter"
            />
            <Outlet />

        </>
    );
}
