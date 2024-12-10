import {
    type ActionFunction,
    type LoaderFunction,
    type MetaFunction,
    redirect,
} from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
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
import Breadcrumbs from '~/components/shared/breadcrumbs';

export const meta: MetaFunction = () => {
    return [{ title: 'Adaptere' }, { name: 'description', content: 'Liste over adaptere' }];
};
interface IPageLoaderData {
    adapters?: IAdapter[];
    orgName: string;
}

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);
    const adaptersResponse = await AdapterAPI.getAdapters(orgName);

    const adapters = adaptersResponse.data || [];
    adapters.sort((a: { shortDescription: string }, b: { shortDescription: string }) =>
        a.shortDescription.localeCompare(b.shortDescription)
    );

    return new Response(JSON.stringify({ adapters, orgName }), {
        headers: { 'Content-Type': 'application/json' },
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

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const detailedInfo = formData.get('detailedInfo') as string;

    const orgName = await getSelectedOrganization(request);
    const newAdapter: IPartialAdapter = {
        name,
        shortDescription: description,
        note: detailedInfo,
    };

    const response = await AdapterAPI.createAdapter(newAdapter, orgName);

    if (!response.success) {
        throw new Response('Kunne ikke opprette ny adapter.');
    }

    return redirect(`/adapter/${response.data?.name}`);
};
