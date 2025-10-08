import { ComponentIcon } from '@navikt/aksel-icons';
import { type ApiResponse, NovariSnackbar, useAlerts } from 'novari-frontend-components';
import { type ActionFunctionArgs, type MetaFunction, useFetcher, useLoaderData } from 'react-router';

import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { handleComponentIndexAction } from '~/routes/komponenter._index/actions';
import ComponentsTable from '~/routes/komponenter._index/ComponentsTable';
import { IComponent } from '~/types/Component';

import { loader } from './loaders';


export const meta: MetaFunction = () => {
    return [{ title: 'Komponenter' }, { name: 'description', content: 'Liste over komponenter' }];
};

export { loader };

export const action = async (args: ActionFunctionArgs) => handleComponentIndexAction(args);

export default function Index() {
    const breadcrumbs = [{ name: 'Komponenter', link: '/komponenter' }];
    const { components, orgName } = useLoaderData<{ components: IComponent[]; orgName: string }>();
    const fetcher = useFetcher<ApiResponse<IComponent>>();
    const actionData = fetcher.data as ApiResponse<IComponent>;
    const { alertState } = useAlerts<IComponent>([], actionData, fetcher.state);
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
            <NovariSnackbar
                items={alertState}
                position={'top-right'}
                // onCloseItem={handleCloseItem}
            />

            <ComponentsTable
                items={components}
                selectedItems={selectedComponents}
                toggle={handleFormSubmit}
                isManaged={false}
            />
        </>
    );
}
