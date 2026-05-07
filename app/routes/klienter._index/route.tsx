import { TokenIcon } from '@navikt/aksel-icons';
import {
    Box,
    Button,
    Chips,
    HStack,
    InlineMessage,
    ProgressBar,
    Search,
    VStack,
} from '@navikt/ds-react';
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
import { handleClientIndexAction } from '~/routes/klienter._index/actions';
import ClientCreateForm from '~/routes/klienter._index/CreateForm';
import { IClient, IClientModelVersion } from '~/types/Clients';

import { loader } from './loaders';
import { InternalPageHeader } from '~/components/shared/InternalPageHeader';

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
const CURRENT_TIME_MS = Date.now();

type LoginStatusFilter = 'missing' | 'stale' | 'warning' | 'ok';
const DEFAULT_STATUS_FILTERS: LoginStatusFilter[] = ['missing', 'stale', 'ok'];

const getLastLoginStatus = (lastLoginTime?: string | null): LoginStatusFilter => {
    if (lastLoginTime === null || lastLoginTime === undefined) {
        return 'missing';
    }

    const parsedDate = new Date(lastLoginTime);
    if (Number.isNaN(parsedDate.getTime())) {
        return 'missing';
    }

    const diffInDays = (CURRENT_TIME_MS - parsedDate.getTime()) / MILLISECONDS_PER_DAY;

    if (diffInDays > 30) {
        return 'stale';
    }

    if (diffInDays > 7) {
        return 'warning';
    }

    return 'ok';
};

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
    // const [filteredClients, setFilteredClients] = useState(clientData);
    const [isCreating, setIsCreating] = useState(false);
    // const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const [searchState, setSearchState] = useState({
        orgName,
        value: '',
    });
    const [statusFilters, setStatusFilters] = useState<LoginStatusFilter[]>(DEFAULT_STATUS_FILTERS);

    const searchValue = searchState.orgName === orgName ? searchState.value : '';

    const filteredClients = clientData.filter((client) => {
        const query = searchValue.toLowerCase();
        const clientStatus = getLastLoginStatus(client.lastLoginTime);

        return (
            (client.name.toLowerCase().includes(query) ||
                client.shortDescription.toLowerCase().includes(query)) &&
            statusFilters.includes(clientStatus)
        );
    });

    const handleSearch = (value: string) => {
        setSearchState({ orgName, value });
    };

    const fetcher = useFetcher();
    const actionData = fetcher.data as ApiResponse<IClient>;
    const { alertState, setAlertState } = useAlerts<IClient>([], actionData, fetcher.state);
    useDeletedSearchParamAlert({
        label: t('mainRoutes.clientsIndex.deletedLabel'),
        setAlertState,
    });

    const handleCreate = () => {
        setIsCreating(true);
    };

    // const handleSearch = (value: string) => {
    //     setSearchValue(value);
    //     const query = value.toLowerCase();
    //     setFilteredClients(
    //         clientData.filter(
    //             (client) =>
    //                 client.name.toLowerCase().includes(query) ||
    //                 client.shortDescription.toLowerCase().includes(query)
    //         )
    //     );
    // };

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
                    <Box padding="space-16" background="info-soft" borderRadius="12">
                        {(modelVersion?.V3 ?? 0) === 0 && (modelVersion?.V4 ?? 0) > 0 ? (
                            <InlineMessage status="success">
                                Konvertering til V4 fullført
                            </InlineMessage>
                        ) : (
                            <InlineMessage status="info">
                                {modelVersion?.V4 ?? 0} av{' '}
                                {(modelVersion?.V3 ?? 0) + (modelVersion?.V4 ?? 0)} klienter
                                konvertert til V4 i utdanningsdomenet
                                <ProgressBar
                                    value={modelVersion?.V4 ?? 0}
                                    valueMax={(modelVersion?.V3 ?? 0) + (modelVersion?.V4 ?? 0)}
                                    size="small"
                                    aria-labelledby="progress-bar-label-small"
                                />
                            </InlineMessage>
                        )}
                    </Box>

                    <VStack gap={'space-8'}>
                        <Box padding="space-16">
                            <HStack gap="space-8" align="center">
                                {/*<div className="min-w-0 flex-1">*/}
                                <Search
                                    label={t('mainRoutes.clientsIndex.searchLabel')}
                                    hideLabel
                                    variant="secondary"
                                    size="small"
                                    value={searchValue}
                                    onChange={handleSearch}
                                    placeholder={t('mainRoutes.clientsIndex.searchPlaceholder')}
                                    data-cy="search-input"
                                    className="min-w-0 flex-1"
                                />
                                {/*</div>*/}
                                <Chips size="small">
                                    <Chips.Toggle
                                        selected={statusFilters.includes('missing')}
                                        onClick={() =>
                                            setStatusFilters((prev) =>
                                                prev.includes('missing')
                                                    ? prev.filter((status) => status !== 'missing')
                                                    : [...prev, 'missing']
                                            )
                                        }
                                        data-color="info">
                                        Ingen innlogging
                                    </Chips.Toggle>
                                    <Chips.Toggle
                                        selected={statusFilters.includes('stale')}
                                        onClick={() =>
                                            setStatusFilters((prev) =>
                                                prev.includes('stale')
                                                    ? prev.filter((status) => status !== 'stale')
                                                    : [...prev, 'stale']
                                            )
                                        }
                                        data-color="danger">
                                        Over 30 dager
                                    </Chips.Toggle>

                                    <Chips.Toggle
                                        selected={statusFilters.includes('ok')}
                                        onClick={() =>
                                            setStatusFilters((prev) =>
                                                prev.includes('ok')
                                                    ? prev.filter((status) => status !== 'ok')
                                                    : [...prev, 'ok']
                                            )
                                        }
                                        data-color="success">
                                        Nylig innlogging
                                    </Chips.Toggle>
                                </Chips>
                            </HStack>
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
                                    isManaged={(item) => item.managed}
                                    lastLoginTime={(item) => item.lastLoginTime}
                                />
                            )}
                        </Box>
                    </VStack>
                </>
            )}
        </>
    );
}
