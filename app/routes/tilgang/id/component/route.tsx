import { KeyVerticalIcon } from '@navikt/aksel-icons';
import { Alert } from '@navikt/ds-react';
import { ApiResponse, NovariSnackbar, useAlerts } from 'novari-frontend-components';
import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    useFetcher,
    useLoaderData,
    useNavigate,
} from 'react-router';

import AccessApi from '~/api/AccessApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { handleAccessElementAction } from '~/routes/tilgang/id/component/actions';
import ResourcesList from '~/routes/tilgang/id/component/ResourcesList';
import { IAccessComponent } from '~/types/Access';
import { IComponent } from '~/types/Component';

export const action = async (args: ActionFunctionArgs) => handleAccessElementAction(args);

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const clientOrAdapter = params.id || '';
    const component = params.component || '';

    const resourceList = await AccessApi.getComponentAccess(component, clientOrAdapter);

    return Response.json({
        clientOrAdapter,
        resourceList: resourceList.data,
        component,
    });
};

export default function Route() {
    const { clientOrAdapter, resourceList, component } = useLoaderData<{
        clientOrAdapter: string;
        resourceList: IAccessComponent[];
        component: string;
    }>();
    const navigate = useNavigate();
    const resourceTitle = `${clientOrAdapter}/${component}`;
    const fetcher = useFetcher<ApiResponse<IComponent>>();
    const actionData = fetcher.data as ApiResponse<IComponent>;
    const { alertState } = useAlerts<IComponent>([], actionData, fetcher.state);

    const elementType =
        clientOrAdapter.split('@')[1]?.split('.')[0] === 'client' ? 'klienter' : 'adapter';

    const handleSelectedResource = (resourceName: string) => {
        navigate(`/tilgang/${clientOrAdapter}/${component}/${resourceName}`);
    };

    const breadcrumbs = [
        { name: `${elementType}`, link: `/${elementType}` },
        { name: clientOrAdapter, link: `/${elementType}/${clientOrAdapter}` },
        {
            name: component,
            link: `/tilgang/${clientOrAdapter}/${component}`,
        },
    ];

    function handleToggleResource(formData: FormData) {
        formData.append('actionType', 'ENABLE_RESOURCE');
        formData.append('username', clientOrAdapter);
        formData.append('component', component);
        fetcher.submit(formData, { method: 'post' });
    }

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <InternalPageHeader
                title={`Tilgang - ${elementType}`}
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

            <ResourcesList
                accessComponent={resourceList as IAccessComponent[]}
                title={resourceTitle || ''}
                onSelected={handleSelectedResource}
                onToggle={handleToggleResource}
            />
        </div>
    );
}
