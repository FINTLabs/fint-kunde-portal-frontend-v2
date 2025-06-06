import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import AccessApi from '~/api/AccessApi';
import ResourcesList from '~/routes/tilgang/id/component/ResourcesList';
import React from 'react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { KeyVerticalIcon } from '@navikt/aksel-icons';
// import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import useAlerts from '~/components/useAlerts';
import AlertManager from '~/components/AlertManager';
import { handleAccessElementAction } from '~/routes/tilgang/id/component/actions';

export const action = async (args: ActionFunctionArgs) => handleAccessElementAction(args);

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const clientOrAdapter = params.id || '';
    const component = params.component || '';

    let resourceList = await AccessApi.getComponentAccess(component, clientOrAdapter);

    return new Response(
        JSON.stringify({
            clientOrAdapter,
            resourceList: resourceList.data,
            component,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
};

export default function Route() {
    const { clientOrAdapter, resourceList, component } = useLoaderData<typeof loader>();
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
