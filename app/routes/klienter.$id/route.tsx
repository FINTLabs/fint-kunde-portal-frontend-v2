import React from 'react';
import { useFetcher, useLoaderData, useNavigate, useParams } from '@remix-run/react';
import { IClient } from '~/types/Clients';
import { ActionFunctionArgs } from '@remix-run/node';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { ArrowLeftIcon, TokenIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, Checkbox, CheckboxGroup, Heading, HGrid } from '@navikt/ds-react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import { IComponent } from '~/types/Component';
import { getComponentIds } from '~/utils/helper';
import ComponentList from '~/components/shared/ComponentList';
import { IAccess, IPackageAccess } from '~/types/Access';
import AlertManager from '~/components/AlertManager';
import ComponentsTable from '~/routes/komponenter._index/ComponentsTable';
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
    const { client, components, features, access, accessComponentList } = useLoaderData<{
        client: IClient;
        components: IComponent[];
        features: Record<string, boolean>;
        access: IAccess;
        accessComponentList: IPackageAccess[];
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
        formData.append('actionType', 'UPDATE_COMPONENT_IN_CLIENT');
        formData.append('adapterName', client?.name as string);
        fetcher.submit(formData, { method: 'post' });
    };

    function handleEnvChange(values: string[]) {
        const formData = new FormData();
        formData.append('actionType', 'UPDATE_ENVIRONMENT');
        values.forEach((value) => formData.append('environments[]', value));
        fetcher.submit(formData, { method: 'post' });
    }

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

                        {hasAccessControl ? (
                            <>
                                <Heading size={'medium'}>Tilgangsstyring for Komponenter</Heading>

                                <Box padding={'6'}>
                                    <CheckboxGroup
                                        legend="Environment: "
                                        onChange={(values) => handleEnvChange(values)}
                                        defaultValue={access.allowedEnvironments}>
                                        <HGrid gap="6" columns={3}>
                                            <Checkbox value="api">API</Checkbox>
                                            <Checkbox value="beta">Beta</Checkbox>
                                            <Checkbox value="alpha">Alpha</Checkbox>
                                        </HGrid>
                                    </CheckboxGroup>
                                </Box>

                                {accessComponentList && accessComponentList.length > 0 && (
                                    <ComponentList
                                        accessList={accessComponentList}
                                        entity={client.name}
                                        onToggle={handleToggle}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                <Heading size={'medium'}>Komponenter</Heading>
                                <ComponentsTable
                                    items={components}
                                    selectedItems={getComponentIds(client.components)}
                                    toggle={handleToggle}
                                    isManaged={client.managed}
                                />
                            </>
                        )}
                    </Box>
                </HGrid>
            )}
        </>
    );
}
