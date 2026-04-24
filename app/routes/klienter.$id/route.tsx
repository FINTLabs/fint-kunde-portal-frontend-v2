import { ShieldCheckmarkIcon, TasklistSendIcon, TokenIcon } from '@navikt/aksel-icons';
import {
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    Heading,
    HGrid,
    HStack,
    LocalAlert,
    Modal,
    VStack,
} from '@navikt/ds-react';
import { type ApiResponse, NovariToaster, useAlerts } from 'novari-frontend-components';
import { useState } from 'react';
import { type ActionFunctionArgs, useFetcher, useLoaderData, useParams } from 'react-router';

import { AuthTable } from '~/components/shared/AuthTable';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import ComponentList from '~/routes/klienter.$id/ComponentList';
import ComponentAccessAudit from '~/routes/klienter.$id/ComponentAccessAudit';
import { InternalPageHeader } from '~/components/shared/InternalPageHeader';
import { handleClientAction } from '~/routes/klienter.$id/actions';
import {
    Environment,
    IAccess,
    IAccessAudit,
    IComponentAccessLog,
    IDomainPackages,
} from '~/types/Access';
import { IClient } from '~/types/Clients';

import { loader } from './loaders';
import ComponentsTable from '~/routes/komponenter._index/ComponentsTable';
import { IComponent } from '~/types';
import ComponentAccessLog from '~/routes/klienter.$id/ComponentAccessLog';
import { DetailView } from '~/routes/klienter.$id/DetailView';

export { loader };

export const handle = {
    analytics: {
        pageType: 'client',
        pathPattern: '/klienter/:id',
    },
};

export const action = async (args: ActionFunctionArgs) => handleClientAction(args);

interface IExtendedFetcherResponseData extends ApiResponse<IClient> {
    clientSecret?: string;
}

export default function ClientDetails() {
    const {
        client,
        access,
        accessComponentList,
        accessAuditLogs,
        accessLog,
        hasAccessControl,
        components,
    } = useLoaderData<{
        client: IClient;
        access: IAccess;
        accessComponentList: IDomainPackages[];
        accessAuditLogs: IAccessAudit | null;
        accessLog: IComponentAccessLog | null;
        hasAccessControl: boolean;
        components: IComponent[];
    }>();

    //TODO: Remove this when access control is fully implemented
    const selectedComponents =
        client?.components
            .map((component) => {
                const matchedComponent = components.find((c) => c.dn === component);
                return matchedComponent?.name;
            })
            .filter((name): name is string => name !== undefined) || [];

    const [isAuditOpen, setIsAuditOpen] = useState(false);
    const [isLogOpen, setIsLogOpen] = useState(false);

    // const navigate = useNavigate();

    const { id } = useParams();
    const breadcrumbs = [
        { name: 'Klienter', link: '/klienter' },
        { name: `${id}`, link: `/klienter/${id}` },
    ];

    const fetcher = useFetcher<IExtendedFetcherResponseData>();
    const actionData = fetcher.data as IExtendedFetcherResponseData;
    const { alertState } = useAlerts<IClient>([], fetcher.data, fetcher.state);
    const [isLoading, setIsLoading] = useState(false);

    let selectedEnvs: Environment[] = [];
    if (access?.environments)
        selectedEnvs = (Object.keys(access.environments) as Environment[]).filter(
            (env) => access.environments[env]
        );

    const handleUpdate = (formData: FormData) => {
        formData.append('actionType', 'UPDATE_CLIENT');
        formData.append('clientId', client.name);
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
        // TODO: Fix this when access control is finished
        // formData.append('actionType', 'ADD_COMPONENT_ACCESS_NEW');
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

    //TODO: clean up in username & clientId
    function addAccess() {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('actionType', 'ADD_ACCESS');
        formData.append('username', client?.name as string);
        formData.append('clientId', client?.name as string);
        fetcher.submit(formData, { method: 'post' });
    }

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={client?.shortDescription || 'Klient'} icon={TokenIcon} />
            <NovariToaster
                items={alertState.map((item) => ({
                    ...item,
                    open: true,
                    show: true,
                }))}
                position="top-right"
            />

            {client ? (
                <VStack gap={'space-24'}>
                    <Box
                        padding="space-16"
                        borderColor="neutral-subtle"
                        borderWidth="2"
                        borderRadius="12">
                        <DetailView
                            resource={client}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    </Box>

                    {!client.managed && (
                        <Box
                            padding="space-16"
                            borderColor="neutral-subtle"
                            borderWidth="2"
                            borderRadius="12">
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
                        </Box>
                    )}

                    <Box
                        padding="space-16"
                        borderColor="neutral-subtle"
                        borderWidth="2"
                        borderRadius="12">
                        {hasAccessControl && access ? (
                            <>
                                <HStack>
                                    <Heading size={'medium'}>
                                        Tilgangsstyring for Komponenter
                                    </Heading>
                                    <Box
                                        className="w-full flex-1"
                                        style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            size="xsmall"
                                            variant="tertiary"
                                            icon={<TasklistSendIcon />}
                                            onClick={() => setIsAuditOpen(true)}>
                                            Endringslogg
                                        </Button>
                                        <Button
                                            size="xsmall"
                                            variant="tertiary"
                                            icon={<ShieldCheckmarkIcon />}
                                            onClick={() => setIsLogOpen(true)}>
                                            Tilgangslogg
                                        </Button>
                                    </Box>
                                </HStack>

                                <Box padding={'space-6'}>
                                    <CheckboxGroup
                                        legend="Miljø:"
                                        onChange={(vals) => handleEnvChange(vals as Environment[])}
                                        defaultValue={selectedEnvs}
                                        data-cy={'env-checkbox-group'}>
                                        <HGrid gap="space-6" columns={4}>
                                            <Checkbox value="api">API</Checkbox>
                                            <Checkbox value="beta">Beta</Checkbox>
                                            <Checkbox value="alpha">Alpha</Checkbox>
                                            <Checkbox value="pwf">PWF</Checkbox>
                                        </HGrid>
                                    </CheckboxGroup>
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

                                <Modal
                                    open={isLogOpen}
                                    onClose={() => setIsLogOpen(false)}
                                    header={{ heading: 'Access Log' }}>
                                    <Modal.Body>
                                        <ComponentAccessLog accessLog={accessLog} />
                                    </Modal.Body>
                                </Modal>
                            </>
                        ) : !hasAccessControl ? (
                            <Box padding="space-6">
                                <ComponentsTable
                                    items={components}
                                    selectedItems={selectedComponents}
                                    toggle={handleToggle}
                                    isManaged={client.managed}
                                    fromClient={client.name}
                                />
                            </Box>
                        ) : (
                            <Box padding="space-6">
                                <LocalAlert status="announcement">
                                    <LocalAlert.Header>
                                        <LocalAlert.Title>Ikke aktivert</LocalAlert.Title>
                                    </LocalAlert.Header>
                                    <LocalAlert.Content>
                                        Tilgangsstyring for komponenter er ikke aktivert
                                    </LocalAlert.Content>
                                </LocalAlert>

                                <Button onClick={addAccess} size={'small'} loading={isLoading}>
                                    Sett opp tilgangsstyring
                                </Button>
                            </Box>
                        )}
                    </Box>
                </VStack>
            ) : (
                <LocalAlert status="announcement">
                    <LocalAlert.Header>
                        <LocalAlert.Title>Klient ikke funnet</LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>Kunne ikke laste klientdetaljer.</LocalAlert.Content>
                </LocalAlert>
            )}
        </>
    );
}
