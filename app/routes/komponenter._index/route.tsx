import { ActionFunctionArgs, type LoaderFunction, MetaFunction } from '@remix-run/node';
import { ComponentIcon } from '@navikt/aksel-icons';
import { useFetcher, useLoaderData } from '@remix-run/react';
import ComponentApi from '~/api/ComponentApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import ComponentsTable from '~/routes/komponenter._index/ComponentsTable';
import { IComponent } from '~/types/Component';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import OrganisationApi from '~/api/OrganisationApi';
import React from 'react';
import AlertManager from '~/components/AlertManager';
import useAlerts from '~/components/useAlerts';
import { ApiResponse } from '~/api/ApiManager';

export const meta: MetaFunction = () => {
    return [{ title: 'Komponenter' }, { name: 'description', content: 'Liste over komponenter' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);
    const components = await ComponentApi.getAllComponents();

    return new Response(JSON.stringify({ components: components.data, orgName: orgName }), {
        headers: { 'Content-Type': 'application/json' },
    });
};

export default function Index() {
    const breadcrumbs = [{ name: 'Komponenter', link: '/komponenter' }];
    const { components, orgName } = useLoaderData<{ components: IComponent[]; orgName: string }>();
    const fetcher = useFetcher<ApiResponse<any>>();
    const { alerts } = useAlerts(fetcher.data, fetcher.state);
    const selectedComponents = components
        .filter((component) => component.organisations.some((org) => org.includes(orgName)))
        .map((component) => component.name);

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
                selectedItems={selectedComponents}
                toggle={handleFormSubmit}
            />
        </>
    );
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    const orgName = await getSelectedOrganization(request);
    const componentName = formData.get('componentName') as string;
    const isChecked = formData.get('isChecked') === 'true';

    return await OrganisationApi.updateComponent(componentName, orgName, isChecked);
};
