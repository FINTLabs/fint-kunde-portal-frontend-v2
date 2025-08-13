import { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { useFetcher, useLoaderData, useNavigate } from 'react-router';
import AccessApi from '~/api/AccessApi';
import ResourcesList from '~/routes/tilgang/id/component/ResourcesList';
import React from 'react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { KeyVerticalIcon } from '@navikt/aksel-icons';

import { IFetcherResponseData } from '~/types/FetcherResponseData';
import useAlerts from '~/components/useAlerts';
import AlertManager from '~/components/AlertManager';
import { handleAccessElementAction } from '~/routes/tilgang/id/component/actions';
// import { getSelectedOrganization } from '~/utils/selectedOrganization';

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
    const fetcher = useFetcher<IFetcherResponseData>();
    const actionData = fetcher.data as IFetcherResponseData;
    const { alerts } = useAlerts(actionData, fetcher.state);

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

            <AlertManager alerts={alerts} />
            <ResourcesList
                accessComponent={resourceList}
                title={resourceTitle || ''}
                onSelected={handleSelectedResource}
                onToggle={handleToggleResource}
            />
        </div>
    );
}
