import {LoaderFunction, MetaFunction} from '@remix-run/node';
import Breadcrumbs from "~/components/breadcrumbs";
import InternalPageHeader from "~/components/InternalPageHeader";
import {ComponentIcon} from "@navikt/aksel-icons";
import React from "react";
import {json, useLoaderData} from "@remix-run/react";
import ComponentApi from "~/api/ComponentApi";

export const meta: MetaFunction = () => {
    return [{ title: 'Komponenter' }, { name: 'description', content: 'Liste over komponenter' }];
};

export const loader: LoaderFunction = async () => {

    try {
        const data = await ComponentApi.fetch();
        return json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {

    const breadcrumbs = [{ name: 'Kontakter', link: '/kontakter' }];
    const data = useLoaderData();
    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
            <InternalPageHeader
                title={'Components'}
                icon={ComponentIcon}
                helpText="contacts"
            />
            {data.length}


        </>
    );
}
