import { type ActionFunctionArgs, type MetaFunction } from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { MigrationIcon } from '@navikt/aksel-icons';
import { useFetcher, useLoaderData, useParams } from '@remix-run/react';
import { Environment, IAccess, IDomainPackages } from '~/types/Access';
import React from 'react';
import { Alert, Box, Button, Checkbox, CheckboxGroup, Heading, HGrid } from '@navikt/ds-react';
import AlertManager from '~/components/AlertManager';
import { BackButton } from '~/components/shared/BackButton';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import { AuthTable } from '~/components/shared/AuthTable';
import ComponentList from '~/components/shared/ComponentList';
import useAlerts from '~/components/useAlerts';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import { IAdapter } from '~/types/Adapter';
import { GeneralDetailView } from '~/components/shared/GeneralDetailView';
import { handleAdapterAction } from '~/routes/adapter.$name/actions';
import { loader } from './loaders';

export const meta: MetaFunction = () => {
    return [{ title: 'Adapter Detaljer' }, { name: 'description', content: 'Adapter Detaljer' }];
};

export { loader };

export const action = async (args: ActionFunctionArgs) => handleAdapterAction(args);

interface IExtendedFetcherResponseData extends IFetcherResponseData {
    clientSecret?: string;
}

export default function Index() {
    // TODO: get adapter based on ID.
    const { adapters, features, access, accessComponentList } = useLoaderData<{
        adapters: IAdapter[];
        features: Record<string, boolean>;
        access: IAccess;
        accessComponentList: IDomainPackages[];
    }>();
    const fetcher = useFetcher<IFetcherResponseData>();
    const actionData = fetcher.data as IExtendedFetcherResponseData;
    const { name } = useParams();
    const hasAccessControl = features['access-controll-new'];
    const breadcrumbs = [
        { name: 'Adaptere', link: '/adaptere' },
        { name: `${name}`, link: `/adapter/${name}` },
    ];

    const filteredAdapters = adapters.filter((a) => a.name === name);
    const adapter = filteredAdapters.length > 0 ? filteredAdapters[0] : null;
    const displayName = adapter?.name.split('@')[0] || '';
    const { alerts } = useAlerts(actionData, fetcher.state);

    let selectedEnvs: Environment[] = [];
    if (access?.environments)
        selectedEnvs = (Object.keys(access.environments) as Environment[]).filter(
            (env) => access.environments[env]
        );

    const handleUpdate = (formData: FormData) => {
        formData.append('actionType', 'UPDATE_ADAPTER');
        fetcher.submit(formData, { method: 'post' });
    };

    const handleDelete = (formData: FormData) => {
        formData.append('actionType', 'DELETE_ADAPTER');
        fetcher.submit(formData, { method: 'post' });
    };

    const handleToggle = (formData: FormData) => {
        formData.append('actionType', 'ADD_COMPONENT_ACCESS');
        formData.append('username', adapter?.name as string);
        formData.append('componentName', formData.get('componentName') as string);
        formData.append('enabled', formData.get('isChecked') as string);
        fetcher.submit(formData, { method: 'post' });
    };

    const handleUpdatePassword = (formData: FormData) => {
        formData.append('actionType', 'UPDATE_PASSWORD');
        fetcher.submit(formData, { method: 'post' });
    };

    const handleUpdateAuthoInfo = (formData: FormData) => {
        formData.append('actionType', 'GET_SECRET');
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
        const formData = new FormData();
        formData.append('actionType', 'ADD_ACCESS');
        formData.append('username', adapter?.name as string);
        fetcher.submit(formData, { method: 'post' });
    }

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={displayName ? displayName : 'Error'}
                icon={MigrationIcon}
                helpText="adapter detaljer"
            />

            <AlertManager alerts={alerts} />

            {!adapter ? (
                <Alert variant="warning">
                    Det finnes ingen adapter ved navn ${name} i listen over adaptere
                </Alert>
            ) : (
                <HGrid gap="2" align={'start'}>
                    <BackButton to={`/adaptere`} className="relative h-12 w-12 top-2 right-14" />
                    <Box
                        className="w-full relative bottom-12"
                        padding="6"
                        borderRadius="large"
                        shadow="small">
                        <GeneralDetailView
                            resource={adapter}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />

                        {!adapter.managed && (
                            <>
                                <Divider className="pt-3" />
                                <Heading size={'medium'}>Autentisering</Heading>
                                <AuthTable
                                    entity={adapter}
                                    entityType="adapter"
                                    onUpdatePassword={handleUpdatePassword}
                                    onUpdateAuthInfo={handleUpdateAuthoInfo}
                                    {...(actionData?.clientSecret
                                        ? { clientSecret: actionData.clientSecret }
                                        : {})}
                                />
                            </>
                        )}
                        <Divider className="pt-3" />

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
                                    entity={adapter.name}
                                    onToggle={handleToggle}
                                />
                            </>
                        ) : (
                            <Box padding="6">
                                <Alert variant="warning">
                                    Tilgangsstyring for komponenter er ikke aktivert
                                </Alert>
                                <Divider className="pt-3" />
                                <Button onClick={addAccess} size={'small'}>
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
