import { ArrowLeftIcon, TokenIcon } from '@navikt/aksel-icons';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    Heading,
    HGrid,
    Modal,
} from '@navikt/ds-react';
import { type ApiResponse, NovariSnackbar, useAlerts } from 'novari-frontend-components';
import { useState } from 'react';
import {
    type ActionFunctionArgs,
    useFetcher,
    useLoaderData,
    useNavigate,
    useParams,
} from 'react-router';

import { AuthTable } from '~/components/shared/AuthTable';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import ComponentList from '~/routes/klienter.$id/ComponentList';
import ComponentAccessAudit from '~/routes/klienter.$id/ComponentAccessAudit';
import { GeneralDetailView } from '~/components/shared/GeneralDetailView';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { handleClientAction } from '~/routes/klienter.$id/actions';
import { Environment, IAccess, IAccessAudit, IDomainPackages } from '~/types/Access';
import { IAdapter } from '~/types/Adapter';
import { IClient } from '~/types/Clients';

import { loader } from './loaders';

export { loader };

export const action = async (args: ActionFunctionArgs) => handleClientAction(args);

interface IExtendedFetcherResponseData extends ApiResponse<IClient> {
    clientSecret?: string;
}

export default function ClientDetails() {
    const { client, access, accessComponentList, accessAuditLogs, hasAccessControl } =
        useLoaderData<{
            client: IClient;
            access: IAccess;
            accessComponentList: IDomainPackages[];
            accessAuditLogs: IAccessAudit | null;
            hasAccessControl: boolean;
        }>();

    const [isAuditOpen, setIsAuditOpen] = useState(false);

    const navigate = useNavigate();

    const { id } = useParams();
    const breadcrumbs = [
        { name: 'Klienter', link: '/klienter' },
        { name: `${id}`, link: `/klienter/${id}` },
    ];

    const fetcher = useFetcher<ApiResponse<IAdapter>>();
    const actionData = fetcher.data as IExtendedFetcherResponseData;
    const { alertState } = useAlerts<IClient>([], actionData, fetcher.state);
    const [isLoading, setIsLoading] = useState(false);

    let selectedEnvs: Environment[] = [];
    if (access?.environments)
        selectedEnvs = (Object.keys(access.environments) as Environment[]).filter(
            (env) => access.environments[env]
        );

    const handleUpdate = (formData: FormData) => {
        formData.append('actionType', 'UPDATE_CLIENT');
        fetcher.submit(formData, { method: 'post' });
    };

    const handleDelete = () => {
        const formData = new FormData();
        formData.append('actionType', 'DELETE_CLIENT');
        formData.append('clientId', client.name);
        fetcher.submit(formData, { method: 'post' });
    };

    const handleUpdatePassword = (formData: FormData) => {
        formData.append('actionType', 'UPDATE_PASSWORD');
        fetcher.submit(formData, { method: 'post' });
    };

    const handleUpdateAuthInfo = (formData: FormData) => {
        formData.append('actionType', 'GET_SECRET');
        fetcher.submit(formData, { method: 'post' });
    };

    const handleToggle = (formData: FormData) => {
        formData.append('actionType', 'ADD_COMPONENT_ACCESS');
        formData.append('username', client?.name as string);
        formData.append('componentName', formData.get('componentName') as string);
        formData.append('enabled', formData.get('isChecked') as string);
        fetcher.submit(formData, { method: 'post' });
    };

    function handleEnvChange(values: Environment[]) {
        const formData = new FormData();
        formData.append('actionType', 'UPDATE_ENVIRONMENT');
        formData.append('username', client?.name as string);
        // append only the checked ones
        values.forEach((v) => formData.append('environments[]', v));
        fetcher.submit(formData, { method: 'post' });
    }

    function addAccess() {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('actionType', 'ADD_ACCESS');
        formData.append('username', client?.name as string);
        fetcher.submit(formData, { method: 'post' });
    }

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={client?.shortDescription || ''} icon={TokenIcon} />

            <NovariSnackbar
                items={alertState}
                position={'top-right'}
                // onCloseItem={handleCloseItem}
            />

            {!client ? (
                <Alert variant="warning">Det finnes ingen klienter ved navn {id} i listen</Alert>
            ) : (
                <HGrid gap="2" align={'start'}>
                    <Box>
                        <Button
                            data-cy="back-button"
                            className="relative h-12 w-12 top-2 right-14"
                            icon={<ArrowLeftIcon title="ArrowLeftIcon" fontSize="1.5rem" />}
                            variant="tertiary"
                            onClick={() => navigate(`/klienter`)}></Button>
                    </Box>

                    <Box
                        className="w-full relative bottom-12"
                        padding="6"
                        borderRadius="large"
                        shadow="small">
                        <GeneralDetailView
                            resource={client}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                        {!client.managed && (
                            <>
                                <Heading size={'medium'}>Autentisering</Heading>
                                <AuthTable
                                    entity={client}
                                    entityType="client"
                                    onUpdatePassword={handleUpdatePassword}
                                    onUpdateAuthInfo={handleUpdateAuthInfo}
                                    {...(actionData?.clientSecret
                                        ? { clientSecret: actionData.clientSecret }
                                        : {})}
                                />
                            </>
                        )}
                        <Box className={'border-b-1 border-gray-200 pb-5'} />

                        {hasAccessControl && access ? (
                            <>
                                <Heading size={'medium'}>Tilgangsstyring for Komponenter</Heading>

                                <Box padding={'6'}>
                                    <CheckboxGroup
                                        legend="Miljø:"
                                        onChange={(vals) => handleEnvChange(vals as Environment[])}
                                        defaultValue={selectedEnvs}
                                        data-cy={'env-checkbox-group'}>
                                        <HGrid gap="6" columns={4}>
                                            <Checkbox value="api">API</Checkbox>
                                            <Checkbox value="beta">Beta</Checkbox>
                                            <Checkbox value="alpha">Alpha</Checkbox>
                                            <Checkbox value="pwf">PWF</Checkbox>
                                        </HGrid>
                                    </CheckboxGroup>
                                </Box>

                                <Box
                                    className="w-full"
                                    style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        size="xsmall"
                                        variant="tertiary"
                                        onClick={() => setIsAuditOpen(true)}>
                                        Endringslogg
                                    </Button>
                                </Box>
                                <ComponentList
                                    accessList={accessComponentList}
                                    entity={client.name}
                                    onToggle={handleToggle}
                                />
                                <Modal
                                    open={isAuditOpen}
                                    onClose={() => setIsAuditOpen(false)}
                                    header={{ heading: 'Endringslogg' }}>
                                    <Modal.Body>
                                        <ComponentAccessAudit audit={accessAuditLogs} />
                                    </Modal.Body>
                                </Modal>
                            </>
                        ) : (
                            <Box padding="6">
                                <Alert variant="warning">
                                    Tilgangsstyring for komponenter er ikke aktivert
                                </Alert>

                                <Button onClick={addAccess} size={'small'} loading={isLoading}>
                                    Sett opp tilgangsstyring
                                </Button>
                            </Box>
                        )}
                    </Box>
                </HGrid>
            )}
        </>
    );
}
