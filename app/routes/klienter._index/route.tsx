import React, { useState } from 'react';
import { json, useLoaderData } from '@remix-run/react';
import ClientApi from '~/api/ClientApi';
import { IClient } from '~/types/Clients';
import ClientTable from '~/routes/klienter._index/ClientTable';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { TokenIcon } from '@navikt/aksel-icons';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { Tabs } from '@navikt/ds-react';

export const loader = async () => {
    const organisation = 'fintlabs_no'; // todo: Replace with actual organisation identifier

    try {
        const clientData = await ClientApi.getClients(organisation);
        return json(clientData);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const clientData = useLoaderData<IClient[]>();
    const breadcrumbs = [{ name: 'Klienter', link: '/klienter' }];
    const [isManaged, setIsManaged] = useState('false');
    const [filteredClients, setFilteredClients] = useState(clientData);

    function handleTabClick(newValue: string) {
        setIsManaged(newValue);
        if (newValue === 'true') {
            setFilteredClients(clientData.filter((client) => client.managed));
        } else {
            setFilteredClients(clientData.filter((client) => !client.managed));
        }
    }

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={'Klienter'}
                icon={TokenIcon}
                helpText="klienter"
                hideBorder={true}
            />

            <Tabs
                value={isManaged}
                onChange={handleTabClick}
                aria-label="hvordan-client-er-opprettet">
                <Tabs.Tab value="false" label="Manuelt opprettet" />
                <Tabs.Tab value="true" label="Automatisk opprettet" />
            </Tabs>

            <ClientTable clients={filteredClients} />
        </>
    );
}
