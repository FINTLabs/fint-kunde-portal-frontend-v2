import { LayersIcon } from '@navikt/aksel-icons';
import { Alert, Box, Heading, HGrid } from '@navikt/ds-react';
import { type ApiResponse, NovariSnackbar, useAlerts } from 'novari-frontend-components';
import {
    type ActionFunctionArgs,
    type MetaFunction,
    useFetcher,
    useLoaderData,
    useParams,
} from 'react-router';

import { AuthTable } from '~/components/shared/AuthTable';
import { BackButton } from '~/components/shared/BackButton';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { GeneralDetailView } from '~/components/shared/GeneralDetailView';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { handleAdapterAction } from '~/routes/adapter.$name/actions';
import { IAdapter } from '~/types/Adapter';

import { loader } from './loaders';
import { IComponent } from '~/types';
import ComponentsTable from '~/routes/komponenter._index/ComponentsTable';

export const meta: MetaFunction = () => {
    return [{ title: 'Adapter Detaljer' }, { name: 'description', content: 'Adapter Detaljer' }];
};

export { loader };

export const action = async (args: ActionFunctionArgs) => handleAdapterAction(args);

interface IExtendedFetcherResponseData extends ApiResponse<IAdapter> {
    clientSecret?: string;
}

export default function Index() {
    const { adapters, components } = useLoaderData<{
        adapters: IAdapter[];
        components: IComponent[];
        orgName: string;
    }>();
    const fetcher = useFetcher<ApiResponse<IAdapter>>();
    const actionData = fetcher.data as IExtendedFetcherResponseData;
    const { name } = useParams();
    // const hasAccessControl = features['access-controll-new'];
    const breadcrumbs = [
        { name: 'Adaptere', link: '/adaptere' },
        { name: `${name}`, link: `/adapter/${name}` },
    ];

    const filteredAdapters = adapters.filter((a) => a.name === name);
    const adapter = filteredAdapters.length > 0 ? filteredAdapters[0] : null;
    const displayName = adapter?.name.split('@')[0] || '';
    const { alertState } = useAlerts<IAdapter>([], actionData, fetcher.state);

    // const [isLoading, setIsLoading] = useState(false);
    //
    // let selectedEnvs: Environment[] = [];
    // if (access?.environments)
    //     selectedEnvs = (Object.keys(access.environments) as Environment[]).filter(
    //         (env) => access.environments[env]
    //     );

    const handleUpdate = (formData: FormData) => {
        formData.append('actionType', 'UPDATE_ADAPTER');
        fetcher.submit(formData, { method: 'post' });
    };

    const handleDelete = (formData: FormData) => {
        formData.append('actionType', 'DELETE_ADAPTER');
        fetcher.submit(formData, { method: 'post' });
    };

    const handleToggle = (formData: FormData) => {
        formData.append('actionType', 'UPDATE_COMPONENT_IN_ADAPTER');
        formData.append('componentName', formData.get('componentName') as string);
        formData.append('adapterName', name as string);
        formData.append('isChecked', formData.get('isChecked') as string);
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

    // function handleEnvChange(values: Environment[]) {
    //     const formData = new FormData();
    //     formData.append('actionType', 'UPDATE_ENVIRONMENT');
    //     // append only the checked ones
    //     values.forEach((v) => formData.append('environments[]', v));
    //     fetcher.submit(formData, { method: 'post' });
    // }
    //
    // function addAccess() {
    //     setIsLoading(true);
    //     const formData = new FormData();
    //     formData.append('actionType', 'ADD_ACCESS');
    //     formData.append('username', adapter?.name as string);
    //     fetcher.submit(formData, { method: 'post' });
    // }
    // // console.log('access', access);

    const selectedComponents = adapter?.components
        .map((adapterComponent) => {
            const matchedComponent = components.find((c) => c.dn === adapterComponent);
            return matchedComponent?.name;
        })
        .filter((name): name is string => name !== undefined) || [];

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={displayName ? displayName : 'Error'}
                icon={LayersIcon}
                helpText="adapter detaljer"
            />

            <NovariSnackbar
                data-cy="snackbar"
                items={alertState}
                position={'top-right'}
                // onCloseItem={handleCloseItem}
            />

            {!adapter ? (
                <Alert variant="warning">Adapter finnes ikke</Alert>
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
                            // <Box className={'border-b-1 border-gray-200 pb-5'}>
                            <Box>
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
                            </Box>
                        )}

                        <Box padding="6">
                            <HGrid gap="2">
                                <Heading size={'medium'}>Komponenter</Heading>


                                        <ComponentsTable items={components} selectedItems={selectedComponents} toggle={handleToggle} isManaged={adapter.managed} fromAdapter={adapter.name} />

                            </HGrid>
                        </Box>

                        {/*{hasAccessControl && access ? (*/}
                        {/*    <>*/}
                        {/*        <Heading size={'medium'}>Tilgangsstyring for Komponenter</Heading>*/}

                        {/*        <Box padding={'6'}>*/}
                        {/*            <CheckboxGroup*/}
                        {/*                legend="Environment:"*/}
                        {/*                onChange={(vals) => handleEnvChange(vals as Environment[])}*/}
                        {/*                defaultValue={selectedEnvs}*/}
                        {/*                data-cy={'env-checkbox-group'}>*/}
                        {/*                <HGrid gap="6" columns={4}>*/}
                        {/*                    <Checkbox value="api">API</Checkbox>*/}
                        {/*                    <Checkbox value="beta">Beta</Checkbox>*/}
                        {/*                    <Checkbox value="alpha">Alpha</Checkbox>*/}
                        {/*                    <Checkbox value="pwf">PWF</Checkbox>*/}
                        {/*                </HGrid>*/}
                        {/*            </CheckboxGroup>*/}
                        {/*        </Box>*/}

                        {/*        <ComponentList*/}
                        {/*            accessList={accessComponentList}*/}
                        {/*            entity={adapter.name}*/}
                        {/*            onToggle={handleToggle}*/}
                        {/*        />*/}
                        {/*    </>*/}
                        {/*) : (*/}
                        {/*    <Box padding="6">*/}
                        {/*        <Alert variant="warning">*/}
                        {/*            Tilgangsstyring for komponenter er ikke aktivert*/}
                        {/*        </Alert>*/}
                        {/*        <Box className={'pt-5'}>*/}
                        {/*            <Button onClick={addAccess} size={'small'} loading={isLoading}>*/}
                        {/*                Sett opp tilgangsstyring*/}
                        {/*            </Button>*/}
                        {/*        </Box>*/}
                        {/*    </Box>*/}
                        {/*)}*/}
                    </Box>
                </HGrid>
            )}
        </>
    );
}
