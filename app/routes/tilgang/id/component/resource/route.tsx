import { KeyVerticalIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, FormSummary, HStack } from '@navikt/ds-react';
import { type ApiResponse, NovariSnackbar, useAlerts } from 'novari-frontend-components';
import {
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
    useFetcher,
    useLoaderData,
    useSearchParams,
} from 'react-router';

import AccessApi from '~/api/AccessApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { handleFieldAccessAction } from '~/routes/tilgang/id/component/resource/actions';
import FieldList from '~/routes/tilgang/id/component/resource/FieldList';
import IconToggleButtons from '~/routes/tilgang/id/component/resource/IconToggleButtons';
import { IField, IResource } from '~/types/Access';


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
    const { alertState } = useAlerts<IField>([], actionData, fetcher.state);

    const [searchParams] = useSearchParams();
    const addedNew = searchParams.get('addedNew');
    if (addedNew === 'true') {
        alertState.push({
            id: 'addedNew',
            message: `Tilgang ble oppdatert for ressurse: ${resource.name}`,
            variant: 'success',
        });
    }

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
        formData.append('actionType', 'UPDATE_RESOURCE');
        formData.append('username', clientOrAdapter);
        formData.append('componentName', componentName);
        formData.append('resourceName', resource.name);
        formData.append('writeable', resource.writeable.toString());
        if (resource.readingOption === 'MULTIPLE') {
            formData.append('readingOption', 'SINGULAR');
        } else {
            formData.append('readingOption', 'MULTIPLE');
        }

        fetcher.submit(formData, { method: 'post' });
    }

    function handleWriteable() {

        const formData = new FormData();
        formData.append('actionType', 'UPDATE_RESOURCE');
        formData.append('username', clientOrAdapter);
        formData.append('componentName', componentName);
        formData.append('resourceName', resource.name);
        formData.append('readingOption', resource.readingOption);
        if (resource.writeable) {
            formData.append('writeable', 'false');
        } else {
            formData.append('writeable', 'true');
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

            <Alert variant="info" style={{ marginBottom: '1rem' }}>
                Velg tilgang ved å krysse av for de riktige feltene nedenfor.
            </Alert>

            <NovariSnackbar
                items={alertState}
                position={'top-right'}
                // onCloseItem={handleCloseItem}
            />

            <FormSummary key={`x`}>
                <FormSummary.Header>
                    <FormSummary.Heading level="2">
                        <HStack gap={'3'}>{fieldListTitle}</HStack>
                        <BodyShort>Skriverettighet: {resource.writeable ? 'true' : 'false'}</BodyShort>
                        <BodyShort>Lesseinstillinger: {resource.readingOption }</BodyShort>
                    </FormSummary.Heading>
                </FormSummary.Header>

                <FormSummary.Answers>
                    <FormSummary.Answer>
                        <IconToggleButtons
                            resource={resource}
                            onClickReadingOptions={() => handleReadingOptions()}
                            onClickIsWriteable={() => handleWriteable()}
                        />

                        <FieldList onToggleField={handleToggleField} fieldList={fieldList || []} />
                    </FormSummary.Answer>
                </FormSummary.Answers>
            </FormSummary>
        </div>
    );
}
