import { ActionFunctionArgs, MetaFunction } from 'react-router';
import { ComponentIcon } from '@navikt/aksel-icons';
import { useFetcher, useLoaderData } from 'react-router';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import ComponentsTable from '~/routes/komponenter._index/ComponentsTable';
import { IComponent } from '~/types/Component';
import React from 'react';
import AlertManager from '~/components/AlertManager';
import useAlerts from '~/components/useAlerts';
import { ApiResponse } from '~/api/ApiManager';
import { handleComponentIndexAction } from '~/routes/komponenter._index/actions';
import { loader } from './loaders';

export const meta: MetaFunction = () => {
    return [{ title: 'Komponenter' }, { name: 'description', content: 'Liste over komponenter' }];
};

export { loader };

export const action = async (args: ActionFunctionArgs) => handleComponentIndexAction(args);

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
                isManaged={false}
            />
        </>
    );
}
