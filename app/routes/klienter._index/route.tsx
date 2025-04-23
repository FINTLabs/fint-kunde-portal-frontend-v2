import React, { useEffect, useState } from 'react';
import { useFetcher, useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import ClientApi from '~/api/ClientApi';
import { IClient, IPartialClient } from '~/types/Clients';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { Search } from '@navikt/ds-react';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { type ActionFunctionArgs, LoaderFunction, MetaFunction, redirect } from '@remix-run/node';
import ClientCreateForm from '~/routes/klienter._index/CreateForm';
import AlertManager from '~/components/AlertManager';
import useAlerts from '~/components/useAlerts';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { TokenIcon } from '@navikt/aksel-icons';
import { CustomTabs } from '~/components/shared/CustomTabs';

export const meta: MetaFunction = () => {
    return [{ title: 'Klienter' }, { name: 'description', content: 'klienter' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);
    const clientsResponse = await ClientApi.getClients(orgName);

    const clientData = clientsResponse.data || [];
    clientData.sort((a: { shortDescription: string }, b: { shortDescription: string }) =>
        a.shortDescription.localeCompare(b.shortDescription)
    );

    return new Response(JSON.stringify({ clientData, orgName }), {
        headers: { 'Content-Type': 'application/json' },
    });
};

interface IPageLoaderData {
    clientData: IClient[];
    orgName: string;
}

export default function Index() {
    const { clientData, orgName } = useLoaderData<IPageLoaderData>();
    const breadcrumbs = [{ name: 'Klienter', link: '/klienter' }];
    const [filteredClients, setFilteredClients] = useState(clientData);
    const [searchParams] = useSearchParams();
    const deleteName = searchParams.get('deleted');
    const [isCreating, setIsCreating] = useState(false);
    const fetcher = useFetcher<IFetcherResponseData>();
    const actionData = fetcher.data as IFetcherResponseData;
    const { alerts } = useAlerts(actionData, fetcher.state, deleteName);
    const navigate = useNavigate();

    useEffect(() => {
        setFilteredClients(clientData);
    }, [clientData]);

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

    const showDetails = (id: string) => {
        navigate(`/klienter/${id}`);
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
                    <InternalPageHeader
                        title={'Klienter'}
                        icon={TokenIcon}
                        helpText={'klienter'}
                        onAddClick={handleCreate}
                    />

                    <Search
                        label="Søk etter klienter"
                        hideLabel
                        variant="secondary"
                        size="small"
                        onChange={(value: string) => handleSearch(value)}
                        placeholder="Søk etter navn eller beskrivelse"
                        className="pb-6"
                    />

                    {filteredClients && (
                        <CustomTabs
                            items={filteredClients}
                            showDetails={showDetails}
                            getItemName={(item) => item.name}
                            getItemDescription={(item) => item.shortDescription}
                            isManaged={(item) => item.managed}
                        />
                    )}
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

    if (!response.success) {
        throw new Response('Kunne ikke opprette ny klient.');
    }

    return redirect(`/klienter/${response.data?.name}`);
}
