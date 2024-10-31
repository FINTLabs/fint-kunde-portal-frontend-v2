import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import AccessApi from '~/api/AccessApi';
import FieldList from '~/routes/tilgang/id/element/resource/FieldList';
import React from 'react';
import { KeyVerticalIcon } from '@navikt/aksel-icons';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import IconToggleButtons from '~/routes/tilgang/id/element/resource/IconToggleButtons';

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

    const breadcrumbs = [
        { name: 'clientOrAdapter list', link: '/' },
        { name: 'tilgang', link: '/' },
        // {
        //     name: element,
        //     link: '/',
        // },
    ];

    function handleSaveFields() {}

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={clientOrAdapter}
                icon={KeyVerticalIcon}
                helpText="NEED_THIS"
            />

            <FieldList
                onSave={handleSaveFields}
                selectedResource={'selectedResource'}
                type={clientOrAdapter || ''}
                title={fieldListTitle}
                fieldList={fieldList || []} // Pass the dynamic fieldList
            />
            <IconToggleButtons
                resourceName={resource}
                onConfirmPosting={handleSaveFields}
                onConfirmAccess={handleSaveFields}
            />
        </div>
    );
}
