import { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { useFetcher, useLoaderData } from 'react-router';
import AccessApi from '~/api/AccessApi';
import FieldList from '~/routes/tilgang/id/component/resource/FieldList';
import React from 'react';
import { KeyVerticalIcon } from '@navikt/aksel-icons';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import IconToggleButtons from '~/routes/tilgang/id/component/resource/IconToggleButtons';
import { handleFieldAccessAction } from '~/routes/tilgang/id/component/resource/actions';
import { IField, IResource } from '~/types/Access';
import { FormSummary, HStack } from '@navikt/ds-react';
import { ApiResponse, NovariSnackbar, useAlerts } from 'novari-frontend-components';

export const action = async (args: ActionFunctionArgs) => handleFieldAccessAction(args);

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const clientOrAdapter = params.id || '';
    const componentName = params.component || '';
    const resourceName = params.resource || '';

    const resource = await AccessApi.getResourceAccess(
        clientOrAdapter,
        componentName,
        resourceName
    );

    const fieldList = await AccessApi.getFieldAccess(clientOrAdapter, componentName, resourceName);

    return Response.json({
        clientOrAdapter,
        componentName,
        resource: resource.data,
        fieldList: fieldList.data,
    });
};

export default function Route() {
    const { clientOrAdapter, componentName, resource, fieldList } = useLoaderData<{
        clientOrAdapter: string;
        componentName: string;
        resource: IResource;
        fieldList: IField[];
    }>();
    const fieldListTitle = `${componentName}/${resource.name}`;
    const fetcher = useFetcher();
    const actionData = fetcher.data as ApiResponse<IField>;
    const { alertState, handleCloseItem } = useAlerts<IField>([], actionData, fetcher.state);

    const elementType =
        clientOrAdapter.split('@')[1]?.split('.')[0] === 'client' ? 'klienter' : 'adaptere';

    const breadcrumbs = [
        { name: `${elementType}`, link: `/${elementType}` },
        { name: clientOrAdapter, link: `/${elementType}/${clientOrAdapter}` },
        {
            name: componentName,
            link: `/tilgang/${clientOrAdapter}/${componentName}`,
        },
        {
            name: resource.name,
            link: `/tilgang/${clientOrAdapter}/${componentName}/${resource.name}`,
        },
    ];

    function handleToggleField(fieldName: string, enabled: boolean) {
        const formData = new FormData();
        formData.append('actionType', 'ENABLE_FIELD');
        formData.append('username', clientOrAdapter);
        formData.append('component', componentName);
        formData.append('resourceName', resource.name);
        formData.append('fieldName', fieldName);
        formData.append('enabled', enabled.toString());
        fetcher.submit(formData, { method: 'post' });
    }

    function handleReadingOptions() {
        const formData = new FormData();
        formData.append('actionType', 'SET_READING_OPTION');
        formData.append('username', clientOrAdapter);
        formData.append('componentName', componentName);
        formData.append('resourceName', resource.name);
        if (resource.readingOption === 'MULTIPLE') {
            formData.append('readingOption', 'SINGULAR');
        } else {
            formData.append('readingOption', 'MULTIPLE');
        }

        fetcher.submit(formData, { method: 'post' });
    }

    function handleWriteable() {
        const formData = new FormData();
        formData.append('actionType', 'SET_IS_WRITEABLE');
        formData.append('username', clientOrAdapter);
        formData.append('componentName', componentName);
        formData.append('resourceName', resource.name);
        if (resource.writeable) {
            formData.append('isWriteable', 'false');
        } else {
            formData.append('isWriteable', 'true');
        }

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

            <NovariSnackbar
                items={alertState}
                position={'top-right'}
                onCloseItem={handleCloseItem}
            />

            <FormSummary key={`x`}>
                <FormSummary.Header>
                    <FormSummary.Heading level="2">
                        <HStack gap={'3'}>{fieldListTitle}</HStack>
                    </FormSummary.Heading>
                </FormSummary.Header>

                <FormSummary.Answers>
                    <FormSummary.Answer>
                        <IconToggleButtons
                            resource={resource}
                            onClickReadingOptions={handleReadingOptions}
                            onClickIsWriteable={handleWriteable}
                        />

                        <FieldList onToggleField={handleToggleField} fieldList={fieldList || []} />
                    </FormSummary.Answer>
                </FormSummary.Answers>
            </FormSummary>
        </div>
    );
}
