import React, { useEffect, useState } from 'react';
import { useFetcher, useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { IClient } from '~/types/Clients';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { Search } from '@navikt/ds-react';
import { type ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import ClientCreateForm from '~/routes/klienter._index/CreateForm';
import AlertManager from '~/components/AlertManager';
import useAlerts from '~/components/useAlerts';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { TokenIcon } from '@navikt/aksel-icons';
import { CustomTabs } from '~/components/shared/CustomTabs';
import { handleClientIndexAction } from '~/routes/klienter._index/actions';
import { loader } from './loaders';

export const meta: MetaFunction = () => {
    return [{ title: 'Klienter' }, { name: 'description', content: 'klienter' }];
};

export { loader };

export const action = async (args: ActionFunctionArgs) => handleClientIndexAction(args);

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
