import { useEffect, useState } from 'react';
import { json, useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import ClientApi from '~/api/ClientApi';
import { IClient } from '~/types/Clients';
import ClientTable from '~/routes/klienter._index/ClientTable';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { PlusIcon, TokenIcon } from '@navikt/aksel-icons';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { Button, HStack, Search, Tabs, VStack } from '@navikt/ds-react';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { LoaderFunction, MetaFunction } from '@remix-run/node';
import { InfoBox } from '~/components/shared/InfoBox';

export const meta: MetaFunction = () => {
    return [{ title: 'Klienter' }, { name: 'description', content: 'klienter' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);

    const clientData = await ClientApi.getClients(orgName);
    return json(clientData);
};

export default function Index() {
    const clientData = useLoaderData<IClient[]>();
    const breadcrumbs = [{ name: 'Klienter', link: '/klienter' }];
    const [isManaged, setIsManaged] = useState('false');
    const [filteredClients, setFilteredClients] = useState(clientData);

    const [searchParams] = useSearchParams();
    const deletedClientName = searchParams.get('deleted');

    const navigate = useNavigate();

    useEffect(() => {
        setFilteredClients(clientData.filter((client) => !client.managed));
    }, [clientData]);

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

    // Handle search input change
    const handleSearch = (value: string) => {
        const query = value.toLowerCase();
        setFilteredClients(
            clientData.filter(
                (client) =>
                    client.name.toLowerCase().includes(query) ||
                    client.shortDescription.toLowerCase().includes(query)
            )
        );
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

            <Search
                label="Søk etter klienter"
                hideLabel
                variant="secondary"
                size="small"
                onChange={(value: string) => handleSearch(value)}
                placeholder="Søk etter navn eller beskrivelse"
                className={'pb-6'}
            />

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
