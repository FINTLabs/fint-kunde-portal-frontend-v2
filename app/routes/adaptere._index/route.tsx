import { LayersIcon, PlusIcon } from '@navikt/aksel-icons';
import { Box, Button, LocalAlert, Search, VStack } from '@navikt/ds-react';
import { type ApiResponse, NovariToaster, useAlerts } from 'novari-frontend-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    type ActionFunctionArgs,
    type MetaFunction,
    useFetcher,
    useLoaderData,
    useNavigate,
} from 'react-router';

import Breadcrumbs from '~/components/shared/breadcrumbs';
import { CustomTabs } from '~/components/shared/CustomTabs';
import { useDeletedSearchParamAlert } from '~/hooks/useDeletedSearchParamAlert';
import { handleAdapterIndexAction } from '~/routes/adaptere._index/actions';
import AdapterCreateForm from '~/routes/adaptere._index/CreateForm';
import { IAdapter } from '~/types/Adapter';
import { InternalPageHeader } from '~/components/shared/InternalPageHeader';
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
    const { t } = useTranslation();
    const breadcrumbs = [{ name: t('adapterIndex.pageTitle'), link: '/adaptere' }];
    const { adapters, orgName } = useLoaderData<IPageLoaderData>();
    const fetcher = useFetcher();
    const actionData = fetcher.data as ApiResponse<IAdapter>;
    const [isCreating, setIsCreating] = useState(false);
    // const [filteredAdapter, setFilteredAdapter] = useState(adapters);
    //
    // const [searchParams, setSearchParams] = useSearchParams();
    // const deleteName = searchParams.get('deleted');
    const [searchValue, setSearchValue] = useState('');

    const filteredAdapters = (adapters ?? [])
        .filter((adapter) => {
            const query = searchValue.toLowerCase();

            return (
                adapter.name.toLowerCase().includes(query) ||
                adapter.shortDescription.toLowerCase().includes(query)
            );
        })
        .sort((a, b) => a.shortDescription.localeCompare(b.shortDescription));
    const handleSearch = (value: string) => {
        setSearchValue(value);
    };
    const { alertState, setAlertState } = useAlerts<IAdapter>([], actionData);

    useDeletedSearchParamAlert({
        label: t('mainRoutes.adaptersIndex.deletedLabel'),
        setAlertState,
    });

    const navigate = useNavigate();

    const handleCreate = () => setIsCreating(true);

    const handleCancelCreate = () => setIsCreating(false);

    const handleSave = (formData: FormData) => {
        fetcher.submit(formData, { method: 'post', action: '/adaptere' });
    };

    // const handleSearch = (value: string) => {
    //     const query = value.toLowerCase();
    //     const filtered = adapters?.filter(
    //         (adapter) =>
    //             adapter.name.toLowerCase().includes(query) ||
    //             adapter.shortDescription.toLowerCase().includes(query)
    //     );
    //
    //     filtered?.sort((a, b) => a.shortDescription.localeCompare(b.shortDescription));
    //     setFilteredAdapter(filtered);
    // };

    const showDetails = (id: string) => navigate(`/adapter/${encodeURIComponent(id)}`);

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
                        title={t('adapterIndex.pageTitle')}
                        icon={LayersIcon}
                        helpText="adapter"
                        // onAddClick={handleCreate}
                    >
                        <Button
                            variant="primary"
                            onClick={handleCreate}
                            size="small"
                            icon={<PlusIcon aria-hidden />}
                            data-cy="create-adapter-button">
                            {t('adapterIndex.createButton')}
                        </Button>
                    </InternalPageHeader>

                    <NovariToaster items={alertState} position={'top-right'} />
                    <VStack gap={'space-8'}>
                        {/*<Box padding="space-16">*/}
                        <Search
                            label={t('adapterIndex.searchLabel')}
                            hideLabel
                            variant="secondary"
                            size="small"
                            value={searchValue}
                            onChange={handleSearch}
                            placeholder={t('adapterIndex.searchPlaceholder')}
                            data-cy="search-input"
                        />
                        {/*</Box>*/}

                        <Box>
                            {adapters && adapters.length === 0 && (
                                <LocalAlert status="announcement">
                                    <LocalAlert.Header>
                                        <LocalAlert.Title>
                                            {t('adapterIndex.emptyState')}
                                        </LocalAlert.Title>
                                    </LocalAlert.Header>
                                </LocalAlert>
                            )}

                            {filteredAdapters.length > 0 && (
                                <CustomTabs
                                    items={filteredAdapters}
                                    showDetails={showDetails}
                                    isManaged={(item) => item.managed}
                                />
                            )}
                        </Box>
                    </VStack>
                </>
            )}
        </>
    );
}
