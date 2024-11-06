import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import AccessApi from '~/api/AccessApi';
import ResourcesList from '~/routes/tilgang/id/element/ResourcesList';
import React from 'react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { KeyVerticalIcon } from '@navikt/aksel-icons';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import useAlerts from '~/components/useAlerts';
import AlertManager from '~/components/AlertManager';
import { handleApiResponse } from '~/utils/handleApiResponse';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const clientOrAdapter = params.id || '';
    const element = params.element || '';

    let resourceList = await AccessApi.getComponentAccess(element, clientOrAdapter);

    return json({
        clientOrAdapter,
        resourceList,
        element,
    });
};

export default function Route() {
    const { clientOrAdapter, resourceList, element } = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    const resourceTitle = `${clientOrAdapter}/${element}`;
    const fetcher = useFetcher<IFetcherResponseData>();
    const actionData = fetcher.data as IFetcherResponseData;
    const { alerts } = useAlerts(actionData, fetcher.state);

    const handleSelectedResource = (resourceName: string) => {
        console.debug('...........', resourceName);
        // setSelectedResource(resourceName);
        navigate(`/tilgang/${clientOrAdapter}/${element}/${resourceName}`);
        // setShow(false);
    };

    const breadcrumbs = [
        { name: clientOrAdapter, link: '/abc' },
        {
            name: element,
            link: '/',
        },
    ];

    function handleToggleResource(formData: FormData) {
        console.log('inside toggle');
        formData.append('actionType', 'TOGGLE_ELEMENT');
        fetcher.submit(formData, { method: 'post' });
    }

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <InternalPageHeader title={'Tilgang'} icon={KeyVerticalIcon} helpText="NEED_THIS" />

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

export async function action({ request }: ActionFunctionArgs) {
    const orgName = await getSelectedOrganization(request);
    const formData = await request.formData();
    const actionType = formData.get('actionType');
    const checkMarkValue = formData.get('checkMarkValue');

    let apiResponse;
    let response;
    switch (actionType) {
        case 'TOGGLE_ELEMENT':
            apiResponse = new Response(null, { status: 200 });
            const variant = checkMarkValue === 'on' ? 'success' : 'warning';
            response = handleApiResponse(apiResponse, `Checkmark: ${checkMarkValue}`, variant);
            break;
        case 'ADD_POLICY':
            response = {
                message: `Checkmark unchecked`,
                variant: 'warning',
                show: true,
            };
            // response = handleApiResponse(updateResponse, `Nytt samtykke lagt til`);
            break;
        default:
            return json({ show: true, message: 'Ukjent handlingstype', variant: 'error' });
    }

    return json(response);
}
