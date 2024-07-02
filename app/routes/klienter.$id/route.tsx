import React from 'react';
import { json, useLoaderData } from '@remix-run/react';
import { IClient } from '~/types/Clients';
import ClientComponent from '~/routes/klienter.$id/ClientComponent';
import ComponentsSection from '~/routes/klienter.$id/ComponentsSection';
import SecuritySection from '~/routes/klienter.$id/SecuritySection';
import type { LoaderFunctionArgs } from '@remix-run/node';
import ClientApi from '~/api/ClientApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { TokenIcon } from '@navikt/aksel-icons';

// @ts-ignore
export const loader = async ({ params }: LoaderFunctionArgs) => {
    const organisation = 'fintlabs_no'; // todo: Replace with actual organisation identifier
    const id = params.id || '';

    try {
        const client = await ClientApi.getClientById(organisation, id);
        return json(client);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const client = useLoaderData<IClient>();

    const breadcrumbs = [
        { name: 'Klienter', link: '/klienter' },
        { name: client.name, link: `/klienter/${client.name}` },
    ];

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={client.shortDescription} icon={TokenIcon} />

            <ClientComponent client={client} />
            <SecuritySection client={client} />
            <ComponentsSection components={client.components} />
        </>
    );
}
