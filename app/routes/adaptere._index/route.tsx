import { LayersIcon } from '@navikt/aksel-icons';
import { Alert, Search } from '@navikt/ds-react';
import { ApiResponse, NovariSnackbar, useAlerts } from 'novari-frontend-components';
import { useEffect, useState } from 'react';
import {
    ActionFunctionArgs,
    type MetaFunction,
    useFetcher,
    useLoaderData,
    useNavigate,
} from 'react-router';

import Breadcrumbs from '~/components/shared/breadcrumbs';
import { CustomTabs } from '~/components/shared/CustomTabs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { useDeletedSearchParamAlert } from '~/hooks/useDeletedSearchParamAlert';
import { handleAdapterIndexAction } from '~/routes/adaptere._index/actions';
import AdapterCreateForm from '~/routes/adaptere._index/CreateForm';
import { IAdapter } from '~/types/Adapter';

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
    const fetcher = useFetcher();
    const actionData = fetcher.data as ApiResponse<IAdapter>;
    const [isCreating, setIsCreating] = useState(false);
    const [filteredAdapter, setFilteredAdapter] = useState(adapters);
    //
    // const [searchParams, setSearchParams] = useSearchParams();
    // const deleteName = searchParams.get('deleted');
    const { alertState, setAlertState } = useAlerts<IAdapter>([], actionData);

    useDeletedSearchParamAlert({
        label: 'Adapter',
        setAlertState,
    });

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
                        icon={LayersIcon}
                        helpText="adaptere"
                        onAddClick={handleCreate}
                    />

                    <NovariSnackbar
                        items={alertState}
                        position={'top-right'}
                        // onCloseItem={handleCloseItem}
                    />

                    <Search
                        label="Søk etter adaptere"
                        hideLabel
                        variant="secondary"
                        size="small"
                        onChange={(value: string) => handleSearch(value)}
                        placeholder="Søk etter navn eller beskrivelse"
                        className={'pb-6'}
                        data-cy="search-input"
                    />

                    {adapters && adapters.length === 0 && (
                        <Alert variant="warning">Ingen adaptere</Alert>
                    )}

                    {filteredAdapter && filteredAdapter.length > 0 && (
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
