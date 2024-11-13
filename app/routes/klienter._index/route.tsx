import React, { useEffect, useState } from 'react';
import { json, useFetcher, useLoaderData, useSearchParams } from '@remix-run/react';
import ClientApi from '~/api/ClientApi';
import { IClient, IPartialClient } from '~/types/Clients';
import ClientTable from '~/routes/klienter._index/ClientTable';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { Tabs } from '@navikt/ds-react';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { type ActionFunctionArgs, LoaderFunction, MetaFunction, redirect } from '@remix-run/node';
import ClientCreateForm from '~/routes/klienter._index/CreateForm';
import AlertManager from '~/components/AlertManager';
import useAlerts from '~/components/useAlerts';
import ClientPageHeader from '~/routes/klienter._index/ClientPageHeader';
import { IFetcherResponseData } from '~/types/FetcherResponseData';

export const meta: MetaFunction = () => {
    return [{ title: 'Klienter' }, { name: 'description', content: 'klienter' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);
    const clientData = await ClientApi.getClients(orgName);
    return json({ clientData, orgName });
};

interface IPageLoaderData {
    clientData: IClient[];
    orgName: string;
}

export default function Index() {
    const { clientData, orgName } = useLoaderData<IPageLoaderData>();
    const breadcrumbs = [{ name: 'Klienter', link: '/klienter' }];
    const [isManaged, setIsManaged] = useState('false');
    const [filteredClients, setFilteredClients] = useState(clientData);
    const [searchParams] = useSearchParams();
    const deleteName = searchParams.get('deleted');
    const [isCreating, setIsCreating] = useState(false);
    const fetcher = useFetcher<IFetcherResponseData>();
    const actionData = fetcher.data as IFetcherResponseData;
    const { alerts } = useAlerts(actionData, fetcher.state, deleteName);

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
        setIsCreating(true);
    };

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

    function handleCancelCreate() {
        setIsCreating(false);
    }

    const handleSave = (formData: FormData) => {
        fetcher.submit(formData, { method: 'post', action: '/klienter' });
    };

    //TODO: clear search on org change
    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <AlertManager alerts={alerts} />
            {isCreating ? (
                <ClientCreateForm
                    onCancel={handleCancelCreate}
                    onSave={handleSave}
                    orgName={orgName}
                />
            ) : (
                <>
                    <ClientPageHeader
                        title="Klienter"
                        helpText="klienter"
                        onCreate={handleCreate}
                        onSearch={handleSearch}
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
            )}
        </>
    );
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const note = formData.get('note') as string;
    const orgName = await getSelectedOrganization(request);

    const newClient: IPartialClient = {
        name: name,
        note: note,
        shortDescription: description,
    };

    const response = await ClientApi.createClient(newClient, orgName);
    return redirect(`/klienter/${response.name}`);
}
