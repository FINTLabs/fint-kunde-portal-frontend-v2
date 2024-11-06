import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import AccessApi from '~/api/AccessApi';
import FieldList from '~/routes/tilgang/id/element/resource/FieldList';
import React from 'react';
import { KeyVerticalIcon } from '@navikt/aksel-icons';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import IconToggleButtons from '~/routes/tilgang/id/element/resource/IconToggleButtons';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { handleApiResponse } from '~/utils/handleApiResponse';
import useAlerts from '~/components/useAlerts';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import AlertManager from '~/components/AlertManager';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const clientOrAdapter = params.id || '';
    const element = params.element || '';
    const resource = params.resource || '';

    const fieldList = await AccessApi.getFieldAccess(clientOrAdapter, element, resource);

    return json({
        clientOrAdapter,
        element,
        resource,
        fieldList,
    });
};

export default function Route() {
    const { clientOrAdapter, element, resource, fieldList } = useLoaderData<typeof loader>();
    const fieldListTitle = `${element}/${resource}`;
    const fetcher = useFetcher<IFetcherResponseData>();
    const actionData = fetcher.data as IFetcherResponseData;
    const { alerts } = useAlerts(actionData, fetcher.state);

    const breadcrumbs = [
        { name: 'clientOrAdapter list', link: '/' },
        { name: 'tilgang', link: '/' },
        // {
        //     name: element,
        //     link: '/',
        // },
    ];

    function handleSaveFields() {
        console.log('inside toggle');
        const formData = new FormData();
        formData.append('actionType', 'SAVE_FIELDS');
        fetcher.submit(formData, { method: 'post' });
    }

    function handleConfirmPosting() {
        const formData = new FormData();
        formData.append('actionType', 'CONFIRM_POSTING');
        fetcher.submit(formData, { method: 'post' });
    }

    function handleConfirmAccess() {
        const formData = new FormData();
        formData.append('actionType', 'CONFIRM_ACCESS');
        fetcher.submit(formData, { method: 'post' });
    }

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <InternalPageHeader
                title={clientOrAdapter}
                icon={KeyVerticalIcon}
                helpText="NEED_THIS"
            />

            <AlertManager alerts={alerts} />

            <FieldList
                onSave={handleSaveFields}
                selectedResource={'selectedResource'}
                type={clientOrAdapter || ''}
                title={fieldListTitle}
                fieldList={fieldList || []}
            />

            <IconToggleButtons
                resourceName={resource}
                onConfirmPosting={handleConfirmPosting}
                onConfirmAccess={handleConfirmAccess}
            />
        </div>
    );
}

export async function action({ request }: ActionFunctionArgs) {
    const orgName = await getSelectedOrganization(request);
    const formData = await request.formData();
    const actionType = formData.get('actionType');

    let apiResponse;
    let response;
    switch (actionType) {
        case 'SAVE_FIELDS':
            apiResponse = new Response(null, { status: 200 });
            response = handleApiResponse(apiResponse, `Fields SAVED! :)`);
            break;
        case 'CONFIRM_POSTING':
            apiResponse = new Response(null, { status: 200 });
            response = handleApiResponse(apiResponse, `Kun enkeltoppslag`);
            break;
        case 'CONFIRM_ACCESS':
            apiResponse = new Response(null, { status: 200 });
            response = handleApiResponse(apiResponse, `Ingen skriverettighet `);
            break;
        default:
            return json({ show: true, message: 'Ukjent handlingstype', variant: 'error' });
    }

    return json(response);
}
