import {
    type ActionFunction,
    json,
    type LoaderFunction,
    type MetaFunction,
    redirect,
} from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { MigrationIcon } from '@navikt/aksel-icons';
import { Alert, Search } from '@navikt/ds-react';
import AdapterAPI from '~/api/AdapterApi';
import { useFetcher, useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { CustomTabs } from '~/components/shared/CustomTabs';
import React, { useEffect, useState } from 'react';
import AdapterCreateForm from '~/routes/adaptere._index/CreateForm';
import AlertManager from '~/components/AlertManager';
import { IAdapter, IPartialAdapter } from '~/types/Adapter';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import useAlerts from '~/components/useAlerts';

interface IPageLoaderData {
    adapters?: IAdapter[];
    orgName: string;
}

export const meta: MetaFunction = () => {
    return [{ title: 'Adapter' }, { name: 'description', content: 'Liste over adapter' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);
    const adapters = await AdapterAPI.getAdapters(orgName);

    adapters.sort((a: { shortDescription: string }, b: { shortDescription: any }) =>
        a.shortDescription.localeCompare(b.shortDescription)
    );

    return json({
        adapters: adapters,
        orgName,
    });
};

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

    useEffect(() => {
        setFilteredAdapter(adapters);
    }, [adapters]);

    const handleCreate = () => {
        setIsCreating(true);
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
    };

    const handleSave = (formData: FormData) => {
        console.log(formData.get('name'));
        fetcher.submit(formData, { method: 'post', action: '/adaptere' });
    };

    const handleSearch = (value: string) => {
        const query = value.toLowerCase();
        const filtered = adapters?.filter(
            (adapter) =>
                adapter.name.toLowerCase().includes(query) ||
                adapter.shortDescription.toLowerCase().includes(query)
        );

        // Sort filtered adapters alphabetically by name
        filtered?.sort((a, b) => a.shortDescription.localeCompare(b.shortDescription));

        setFilteredAdapter(filtered);
    };

    const showDetails = (id: string) => {
        navigate(`/adapter/${id}`);
    };

    //TODO: clear search on org change
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
                    {/*<HStack align={'center'} justify={'space-between'}>*/}
                    <InternalPageHeader
                        title={'Adaptere'}
                        icon={MigrationIcon}
                        helpText="adaptere"
                        onAddClick={handleCreate}
                    />

                    {/*</HStack>*/}
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

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const detailedInfo = formData.get('detailedInfo') as string;

    const orgName = await getSelectedOrganization(request);
    const newAdapter: IPartialAdapter = {
        name: name,
        shortDescription: description,
        note: detailedInfo,
    };

    const response = await AdapterAPI.createAdapter(newAdapter, orgName);
    return redirect(`/adapter/${response.name}`);
};
