import React, { useState } from 'react';
import { json, useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import ClientApi from '~/api/ClientApi';
import { IClient } from '~/types/Clients';
import ClientTable from '~/routes/klienter._index/ClientTable';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { TokenIcon } from '@navikt/aksel-icons';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { Button, HStack, Tabs, VStack } from '@navikt/ds-react';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import type { LoaderFunction } from '@remix-run/node';
import { PlusIcon } from '@navikt/aksel-icons';
import { InfoBox } from '~/components/shared/InfoBox';

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);

    try {
        const clientData = await ClientApi.getClients(orgName);
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

    const [searchParams] = useSearchParams();
    const deletedClientName = searchParams.get('deleted');

    for (const [key, value] of searchParams) {
        console.log(key);
        console.log(value);
    }
    const navigate = useNavigate();

    function handleTabClick(newValue: string) {
        setIsManaged(newValue);
        if (newValue === 'true') {
            setFilteredClients(clientData.filter((client) => client.managed));
        } else {
            setFilteredClients(clientData.filter((client) => !client.managed));
        }
    }

    const handleCreate = () => {
        navigate(`/klienter/create`);
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            {deletedClientName && <InfoBox message={`Klient ${deletedClientName} slettet`} />}
            <HStack align={'center'} justify={'space-between'}>
                <VStack>
                    <InternalPageHeader title={'Klienter'} icon={TokenIcon} helpText="klienter" />
                </VStack>
                <VStack>
                    <Button
                        className="float-right"
                        onClick={handleCreate}
                        icon={<PlusIcon aria-hidden />}>
                        Legg til
                    </Button>
                </VStack>
            </HStack>
            <Tabs
                value={isManaged}
                onChange={handleTabClick}
                fill={true}
                aria-label="hvordan-client-er-opprettet">
                <Tabs.List>
                    <Tabs.Tab value="false" label="Manuelt opprettet" />
                    <Tabs.Tab value="true" label="Automatisk opprettet" />
                </Tabs.List>
            </Tabs>

            <ClientTable clients={filteredClients} />
        </>
    );
}
