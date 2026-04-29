import { TokenIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, LocalAlert, ProgressBar, Search, VStack } from '@navikt/ds-react';
import { type ApiResponse, NovariToaster, useAlerts } from 'novari-frontend-components';
import { useEffect, useState } from 'react';
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
import { handleClientIndexAction } from '~/routes/klienter._index/actions';
import ClientCreateForm from '~/routes/klienter._index/CreateForm';
import { IClient, IClientModelVersion } from '~/types/Clients';

import { loader } from './loaders';
import { InternalPageHeader } from '~/components/shared/InternalPageHeader';

export const meta: MetaFunction = () => {
    return [{ title: 'Klienter' }, { name: 'description', content: 'klienter' }];
};

export { loader };

export const action = async (args: ActionFunctionArgs) => handleClientIndexAction(args);

interface IPageLoaderData {
    clientData: IClient[];
    modelVersion: IClientModelVersion;
    orgName: string;
}

export default function Index() {
    const { t } = useTranslation();
    const { clientData, modelVersion, orgName } = useLoaderData<IPageLoaderData>();
    const breadcrumbs = [{ name: t('menu.clients'), link: '/klienter' }];
    const [filteredClients, setFilteredClients] = useState(clientData);
    const [isCreating, setIsCreating] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

    const fetcher = useFetcher();
    const actionData = fetcher.data as ApiResponse<IClient>;
    const { alertState, setAlertState } = useAlerts<IClient>([], actionData, fetcher.state);
    useDeletedSearchParamAlert({
        label: t('mainRoutes.clientsIndex.deletedLabel'),
        setAlertState,
    });

    useEffect(() => {
        setFilteredClients(clientData);
    }, [clientData]);

    // Clear search when organization changes
    useEffect(() => {
        setSearchValue('');
        setFilteredClients(clientData);
    }, [orgName, clientData]);

    const handleCreate = () => {
        setIsCreating(true);
    };

    const handleSearch = (value: string) => {
        setSearchValue(value);
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
        navigate(`/klienter/${encodeURIComponent(id)}`);
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <NovariToaster
                items={alertState}
                position={'top-right'}
                // onCloseItem={handleCloseItem}
            />

            {isCreating ? (
                <ClientCreateForm
                    onCancel={handleCancelCreate}
                    onSave={handleSave}
                    orgName={orgName}
                    isSubmitting={fetcher.state !== 'idle'}
                    clientData={clientData}
                />
            ) : (
                <>
                    <InternalPageHeader
                        title={t('menu.clients')}
                        icon={TokenIcon}
                        helpText={'klienter'}
                        // onAddClick={handleCreate}
                    >
                        <Button
                            onClick={handleCreate}
                            variant="primary"
                            size="small"
                            className="mr-2"
                            data-cy="create-button">
                            {t('mainRoutes.clientsIndex.createButton')}
                        </Button>
                    </InternalPageHeader>
                    <div className="flex justify-center">
                        {(modelVersion?.V3 ?? 0) === 0 && (modelVersion?.V4 ?? 0) > 0 ? (
                            <LocalAlert status="success" className="mb-4 w-1/2" size="small">
                                <LocalAlert.Header>
                                    <LocalAlert.Title>
                                        Konvertering til V4 fullført
                                    </LocalAlert.Title>
                                </LocalAlert.Header>
                            </LocalAlert>
                        ) : (
                            <LocalAlert status="announcement" className="mb-4 w-1/2" size="small">
                                <LocalAlert.Header>
                                    <LocalAlert.Title>
                                        Konvertering av informasjonsmodellversjon
                                    </LocalAlert.Title>
                                </LocalAlert.Header>
                                <LocalAlert.Content>
                                    <BodyShort>
                                        {modelVersion?.V4 ?? 0} av{' '}
                                        {(modelVersion?.V3 ?? 0) + (modelVersion?.V4 ?? 0)} klienter
                                        konvertert til V4 i utdanningsdomenet
                                    </BodyShort>
                                    <ProgressBar
                                        value={modelVersion?.V4 ?? 0}
                                        valueMax={(modelVersion?.V3 ?? 0) + (modelVersion?.V4 ?? 0)}
                                        size="small"
                                        aria-labelledby="progress-bar-label-small"
                                    />
                                </LocalAlert.Content>
                            </LocalAlert>
                        )}
                    </div>

                    <VStack gap={'space-8'}>
                        <Box padding="space-16">
                            <Search
                                label={t('mainRoutes.clientsIndex.searchLabel')}
                                hideLabel
                                variant="secondary"
                                size="small"
                                value={searchValue}
                                onChange={(value: string) => handleSearch(value)}
                                placeholder={t('mainRoutes.clientsIndex.searchPlaceholder')}
                                // className="pb-6"
                                data-cy="search-input"
                            />
                        </Box>

                        <Box
                            padding="space-16"
                            borderColor="neutral-subtle"
                            borderWidth="2"
                            borderRadius="12">
                            {filteredClients && (
                                <CustomTabs
                                    items={filteredClients}
                                    showDetails={showDetails}
                                    getItemName={(item) => item.name}
                                    getItemDescription={(item) => item.shortDescription}
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
