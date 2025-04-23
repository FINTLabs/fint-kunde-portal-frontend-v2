import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import AccessApi from '~/api/AccessApi';
import FieldList from '~/routes/tilgang/id/element/resource/FieldList';
import React from 'react';
import { KeyVerticalIcon } from '@navikt/aksel-icons';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import IconToggleButtons from '~/routes/tilgang/id/element/resource/IconToggleButtons';
import useAlerts from '~/components/useAlerts';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import AlertManager from '~/components/AlertManager';
import { handleFieldAccessAction } from '~/routes/tilgang/id/element/resource/actions';

export const action = async (args: ActionFunctionArgs) => handleFieldAccessAction(args);

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const clientOrAdapter = params.id || '';
    const element = params.element || '';
    const resource = params.resource || '';

    const fieldList = await AccessApi.getFieldAccess(clientOrAdapter, element, resource);

    return new Response(
        JSON.stringify({
            clientOrAdapter,
            element,
            resource,
            fieldList: fieldList.data,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
};

export default function Route() {
    const { clientOrAdapter, element, resource, fieldList } = useLoaderData<typeof loader>();
    const fieldListTitle = `${element}/${resource}`;
    const fetcher = useFetcher<IFetcherResponseData>();
    const actionData = fetcher.data as IFetcherResponseData;
    const { alerts } = useAlerts(actionData, fetcher.state);

    //TODO: ADD FOR ADAPTER! (for breadcrumbs)
    const elementType = clientOrAdapter.split('@')[1]?.split('.')[0] === 'client' ? 'Klienter' : '';

    const breadcrumbs = [
        { name: `${elementType}`, link: `/${elementType}` },
        { name: clientOrAdapter, link: `/${elementType}/${clientOrAdapter}` },
        {
            name: element,
            link: `/tilgang/${clientOrAdapter}/${element}`,
        },
        {
            name: resource,
            link: `/tilgang/${clientOrAdapter}/${element}/${resource}`,
        },
    ];

    function handleSaveFields() {
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
