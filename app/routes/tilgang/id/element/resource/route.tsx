import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import AccessApi from '~/api/AccessApi';
import FieldList from '~/routes/tilgang/id/element/resource/FieldList';
import React from 'react';

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

    function handleSaveFields() {}

    return (
        <div>
            <h1>{clientOrAdapter}</h1>
            <h1>{element}</h1>
            <h1>{resource}</h1>

            <FieldList
                onSave={handleSaveFields}
                selectedResource={'selectedResource'}
                type={clientOrAdapter || ''}
                fieldList={fieldList || []} // Pass the dynamic fieldList
            />
        </div>
    );
}
