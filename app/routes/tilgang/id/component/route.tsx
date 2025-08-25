import { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { useFetcher, useLoaderData, useNavigate } from 'react-router';
import AccessApi from '~/api/AccessApi';
import ResourcesList from '~/routes/tilgang/id/component/ResourcesList';
import React from 'react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { KeyVerticalIcon } from '@navikt/aksel-icons';
import { handleAccessElementAction } from '~/routes/tilgang/id/component/actions';
import { ApiResponse, NovariSnackbar, useAlerts } from 'novari-frontend-components';
import { IComponent } from '~/types/Component';

export const action = async (args: ActionFunctionArgs) => handleAccessElementAction(args);

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const clientOrAdapter = params.id || '';
    const component = params.component || '';

    let resourceList = await AccessApi.getComponentAccess(component, clientOrAdapter);

    return Response.json({
        clientOrAdapter,
        resourceList: resourceList.data,
        component,
    });
};

export default function Route() {
    const { clientOrAdapter, resourceList, component } = useLoaderData<{
        clientOrAdapter: string;
        resourceList: any;
        component: string;
    }>();
    const navigate = useNavigate();
    const resourceTitle = `${clientOrAdapter}/${component}`;
    const fetcher = useFetcher<ApiResponse<IComponent>>();
    const actionData = fetcher.data as ApiResponse<IComponent>;
    const { alertState, handleCloseItem } = useAlerts<IComponent>([], actionData, fetcher.state);

    const elementType =
        clientOrAdapter.split('@')[1]?.split('.')[0] === 'client' ? 'klienter' : 'adaptere';

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

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <InternalPageHeader
                title={`Tilgang - ${elementType}`}
                icon={KeyVerticalIcon}
                helpText="NEED_THIS"
            />

            <NovariSnackbar
                items={alertState}
                position={'top-right'}
                onCloseItem={handleCloseItem}
            />

            <ResourcesList
                accessComponent={resourceList}
                title={resourceTitle || ''}
                onSelected={handleSelectedResource}
                onToggle={handleToggleResource}
            />
        </div>
    );
}
