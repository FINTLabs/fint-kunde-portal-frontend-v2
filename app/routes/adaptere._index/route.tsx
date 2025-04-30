import { ActionFunctionArgs, type MetaFunction } from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { MigrationIcon } from '@navikt/aksel-icons';
import { Alert, Search } from '@navikt/ds-react';
import { useFetcher, useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { CustomTabs } from '~/components/shared/CustomTabs';
import React, { useState } from 'react';
import AdapterCreateForm from '~/routes/adaptere._index/CreateForm';
import AlertManager from '~/components/AlertManager';
import { IAdapter } from '~/types/Adapter';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import useAlerts from '~/components/useAlerts';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { handleAdapterIndexAction } from '~/routes/adaptere._index/actions';
import { loader } from './loaders';

export const meta: MetaFunction = () => {
    return [{ title: 'Adaptere' }, { name: 'description', content: 'Liste over adaptere' }];
};
interface IPageLoaderData {
    adapters?: IAdapter[];
    orgName: string;
}

export { loader };

export const action = async (args: ActionFunctionArgs) => handleAdapterIndexAction(args);

export default function Index() {
    const breadcrumbs = [{ name: 'Adaptere', link: '/adaptere' }];
    const { adapters, orgName } = useLoaderData<IPageLoaderData>();
    const [searchParams] = useSearchParams();
    const deleteName = searchParams.get('deleted');
    const fetcher = useFetcher<IFetcherResponseData>();
    const actionData = fetcher.data as IFetcherResponseData;
    const [isCreating, setIsCreating] = useState(false);
    const [filteredAdapter, setFilteredAdapter] = useState(adapters);
    const { alerts } = useAlerts(actionData, fetcher.state, deleteName);
    const navigate = useNavigate();

    // useEffect(() => {
    //     setFilteredAdapter(adapters);
    // }, [adapters]);

    const handleCreate = () => setIsCreating(true);

    const handleCancelCreate = () => setIsCreating(false);

    const handleSave = (formData: FormData) => {
        fetcher.submit(formData, { method: 'post', action: '/adaptere' });
    };

    const handleSearch = (value: string) => {
        const query = value.toLowerCase();
        const filtered = adapters?.filter(
            (adapter) =>
                adapter.name.toLowerCase().includes(query) ||
                adapter.shortDescription.toLowerCase().includes(query)
        );

        filtered?.sort((a, b) => a.shortDescription.localeCompare(b.shortDescription));
        setFilteredAdapter(filtered);
    };

    const showDetails = (id: string) => navigate(`/adapter/${id}`);

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            {isCreating ? (
                <AdapterCreateForm
                    onCancel={handleCancelCreate}
                    onSave={handleSave}
                    orgName={orgName}
                />
            ) : (
                <>
                    <InternalPageHeader
                        title={'Adaptere'}
                        icon={MigrationIcon}
                        helpText="adaptere"
                        onAddClick={handleCreate}
                    />
                    <AlertManager alerts={alerts} />

                    <Search
                        label="Søk etter adaptere"
                        hideLabel
                        variant="secondary"
                        size="small"
                        onChange={(value: string) => handleSearch(value)}
                        placeholder="Søk etter navn eller beskrivelse"
                        className={'pb-6'}
                    />

                    {adapters && adapters.length === 0 && (
                        <Alert variant="warning">Ingen adaptere</Alert>
                    )}

                    {filteredAdapter && (
                        <CustomTabs
                            items={filteredAdapter}
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
