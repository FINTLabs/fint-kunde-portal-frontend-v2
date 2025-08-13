import React, { useState } from 'react';
import { useFetcher, useLoaderData, useNavigate, useParams } from 'react-router';
import { IClient } from '~/types/Clients';
import { ActionFunctionArgs } from 'react-router';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { ArrowLeftIcon, TokenIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, Checkbox, CheckboxGroup, Heading, HGrid } from '@navikt/ds-react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import ComponentList from '~/components/shared/ComponentList';
import { Environment, IAccess, IDomainPackages } from '~/types/Access';
import AlertManager from '~/components/AlertManager';
import useAlerts from '~/components/useAlerts';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import { GeneralDetailView } from '~/components/shared/GeneralDetailView';
import { AuthTable } from '~/components/shared/AuthTable';
import { handleClientAction } from '~/routes/klienter.$id/actions';
import { loader } from './loaders';

export { loader };

export const action = async (args: ActionFunctionArgs) => handleClientAction(args);

interface IExtendedFetcherResponseData extends IFetcherResponseData {
    clientSecret?: string;
}

export default function ClientDetails() {
    const { client, features, access, accessComponentList } = useLoaderData<{
        client: IClient;
        features: Record<string, boolean>;
        access: IAccess;
        accessComponentList: IDomainPackages[];
    }>();

    const navigate = useNavigate();
    const hasAccessControl = features['access-controll-new'];

    const { id } = useParams();
    const breadcrumbs = [
        { name: 'Klienter', link: '/klienter' },
        { name: `${id}`, link: `/klienter/${id}` },
    ];

    const fetcher = useFetcher();
    const actionData = fetcher.data as IExtendedFetcherResponseData;
    const { alerts } = useAlerts(actionData, fetcher.state);
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

    //TODO: Button to enable all resources
    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={client?.shortDescription || ''} icon={TokenIcon} />
            <AlertManager alerts={alerts} />

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
                                <Divider className="pt-3" />
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

                        <Divider className="pt-10" />

                        {hasAccessControl && access ? (
                            <>
                                <Heading size={'medium'}>Tilgangsstyring for Komponenter</Heading>

                                <Box padding={'6'}>
                                    <CheckboxGroup
                                        legend="Environment:"
                                        onChange={(vals) => handleEnvChange(vals as Environment[])}
                                        defaultValue={selectedEnvs}>
                                        <HGrid gap="6" columns={4}>
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
                            </>
                        ) : (
                            <Box padding="6">
                                <Alert variant="warning">
                                    Tilgangsstyring for komponenter er ikke aktivert
                                </Alert>
                                <Divider className="pt-3" />
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
