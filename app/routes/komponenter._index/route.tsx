import { ActionFunctionArgs, type LoaderFunction, MetaFunction } from '@remix-run/node';
import { ComponentIcon } from '@navikt/aksel-icons';
import { json, useFetcher, useLoaderData } from '@remix-run/react';
import ComponentApi from '~/api/ComponentApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import ComponentsTable from '~/routes/komponenter._index/ComponentsTable';
import { IComponent } from '~/types/Component';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { getFormData } from '~/utils/requestUtils';
import OrganisationApi from '~/api/OrganisationApi';
import React, { useEffect, useState } from 'react';
import AlertManager from '~/components/AlertManager';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import { handleApiResponse } from '~/utils/handleApiResponse';

export const meta: MetaFunction = () => {
    return [{ title: 'Komponenter' }, { name: 'description', content: 'Liste over komponenter' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const components = await ComponentApi.getAllComponents();
    const orgName = await getSelectedOrganization(request);
    return json({ components, orgName });
};

export default function Index() {
    const breadcrumbs = [{ name: 'Komponenter', link: '/komponenter' }];
    const { components, orgName } = useLoaderData<{ components: IComponent[]; orgName: string }>();
    const fetcher = useFetcher<IFetcherResponseData>();
    const actionData = fetcher.data as IFetcherResponseData;
    const [alerts, setAlerts] = useState<IAlertType[]>([]);
    const selectedCompoents = components
        .filter((component) => component.organisations.some((org) => org.includes(orgName)))
        .map((component) => component.name);

    useEffect(() => {
        console.log('in use effect');
        if (fetcher.state === 'idle' && actionData) {
            setAlerts((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    variant: actionData.variant || 'success',
                    message: actionData.message || 'Handling fullført.',
                },
            ]);
        }
    }, [actionData, fetcher.state]);

    const handleFormSubmit = (formData: FormData) => {
        fetcher.submit(formData, { method: 'post' });
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Komponenter'} icon={ComponentIcon} helpText="components" />
            <AlertManager alerts={alerts} />

            <ComponentsTable
                items={components}
                selectedItems={selectedCompoents}
                toggle={handleFormSubmit}
            />
        </>
    );
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const actionName = 'action update';
    const formData = await request.formData();
    const orgName = await getSelectedOrganization(request);
    const updateType = getFormData(formData.get('isChecked'), 'isChecked', actionName);
    const componentName = getFormData(formData.get('componentName'), 'componentName', actionName);

    const updateResponse = await OrganisationApi.updateComponent(
        componentName,
        orgName,
        updateType
    );
    let response;

    if (updateType === 'true')
        response = handleApiResponse(updateResponse, `Komponent ${componentName} lagt til`);
    else
        response = handleApiResponse(
            updateResponse,
            `Komponent ${componentName} fjernet`,
            'warning'
        );

    return response;
};
