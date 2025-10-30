import { ArrowLeftIcon, KeyVerticalIcon } from '@navikt/aksel-icons';
import React from 'react';
import { Box, Button, HGrid, Modal } from '@navikt/ds-react';
import { type ApiResponse, NovariSnackbar, useAlerts } from 'novari-frontend-components';
import {
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
    useFetcher,
    useLoaderData,
    useNavigate,
    useSearchParams,
} from 'react-router';

import AccessApi from '~/api/AccessApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { handleAccessElementAction } from '~/routes/tilgang/id/component/actions';
import ResourcesList from '~/routes/tilgang/id/component/ResourcesList';
import { IAccessAudit, IAccessComponent } from '~/types/Access';
import { IComponent } from '~/types/Component';
import ComponentAccessAudit from '~/routes/klienter.$id/ComponentAccessAudit';

export const action = async (args: ActionFunctionArgs) => handleAccessElementAction(args);

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const clientOrAdapter = params.id || '';
    const component = params.component || '';

    const resourceList = await AccessApi.getComponentAccess(component, clientOrAdapter);
    const auditLog = await AccessApi.getAccessAudit(clientOrAdapter);

    return Response.json({
        clientOrAdapter,
        resourceList: resourceList.data,
        component,
        auditLog: auditLog.data || [],
    });
};

export default function Route() {
    const { clientOrAdapter, resourceList, component, auditLog } = useLoaderData<{
        clientOrAdapter: string;
        resourceList: IAccessComponent[];
        component: string;
        auditLog: IAccessAudit[];
    }>();
    const [isAuditOpen, setIsAuditOpen] = React.useState(false);
    const navigate = useNavigate();
    const resourceTitle = `${clientOrAdapter}/${component}`;
    const fetcher = useFetcher<ApiResponse<IComponent>>();
    const actionData = fetcher.data as ApiResponse<IComponent>;
    const { alertState } = useAlerts<IComponent>([], actionData, fetcher.state);
    const [searchParams] = useSearchParams();
    const addedNew = searchParams.get('addedNew');
    if (addedNew === 'true') {
        alertState.push({
            id: 'addedNew',
            message: `Tilgang ble oppdatert for ressurse: ${component}`,
            variant: 'success',
        });
    }

    const elementType =
        clientOrAdapter.split('@')[1]?.split('.')[0] === 'client' ? 'klienter' : 'adapter';

    const handleSelectedResource = (resourceName: string) => {
        navigate(`/tilgang/${clientOrAdapter}/${component}/${resourceName}`);
    };

    const breadcrumbs = [
        { name: `${elementType}`, link: `/${elementType}` },
        { name: clientOrAdapter, link: `/${elementType}/${clientOrAdapter}` },
        {
            name: component,
            link: `/tilgang/${clientOrAdapter}/${component}`,
        },
    ];

    function handleToggleResource(formData: FormData) {
        formData.append('actionType', 'ENABLE_RESOURCE');
        formData.append('username', clientOrAdapter);
        formData.append('component', component);
        fetcher.submit(formData, { method: 'post' });
    }

    function handleBulkToggle(formData: FormData) {
        const isDisable = formData.get('disable') === 'true';
        formData.delete('disable');
        formData.append('actionType', isDisable ? 'DISABLE_ALL_RESOURCES' : 'ENABLE_ALL_RESOURCES');
        formData.append('username', clientOrAdapter);
        formData.append('component', component);
        fetcher.submit(formData, { method: 'post' });
    }

    return (
        <HGrid gap="2" align={'start'}>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <InternalPageHeader
                title={`Tilgang - ${elementType}`}
                icon={KeyVerticalIcon}
                helpText="NEED_THIS"
            />
            <Box>
                <Button
                    data-cy="back-button"
                    className="relative h-12 w-12 top-2 right-14"
                    icon={<ArrowLeftIcon title="ArrowLeftIcon" fontSize="1.5rem" />}
                    variant="tertiary"
                    onClick={() => navigate(`/${elementType}/${clientOrAdapter}`)}></Button>
            </Box>

            <Box
                className="w-full relative bottom-12"
                padding="6"
                borderRadius="large"
                shadow="small">
                <Box className="w-full" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button size="xsmall" variant="tertiary" onClick={() => setIsAuditOpen(true)}>
                        Endringslogg
                    </Button>
                </Box>

                <NovariSnackbar
                    items={alertState}
                    position={'top-right'}
                    // onCloseItem={handleCloseItem}
                />

                <ResourcesList
                    accessComponent={resourceList as IAccessComponent[]}
                    title={resourceTitle || ''}
                    onSelected={handleSelectedResource}
                    onToggle={handleToggleResource}
                    onBulkToggle={handleBulkToggle}
                    isSubmitting={fetcher.state === 'submitting' || fetcher.state === 'loading'}
                />
                <Modal
                    open={isAuditOpen}
                    onClose={() => setIsAuditOpen(false)}
                    header={{ heading: 'Endringslogg' }}>
                    <Modal.Body>
                        <ComponentAccessAudit audit={auditLog || []} />
                    </Modal.Body>
                </Modal>
            </Box>
        </HGrid>
    );
}
