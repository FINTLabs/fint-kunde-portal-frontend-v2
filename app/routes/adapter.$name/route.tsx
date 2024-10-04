import {
    type ActionFunctionArgs,
    json,
    type LoaderFunctionArgs,
    type MetaFunction,
} from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { MigrationIcon } from '@navikt/aksel-icons';
import { useLoaderData, useParams } from '@remix-run/react';
import { AdapterDetail } from './AdapterDetail';
import { IAdapter } from '~/types/types';
import ComponentApi from '~/api/ComponentApi';
import AdapterApi from '~/api/AdapterApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { InfoBox } from '~/components/shared/InfoBox';
import FeaturesApi from '~/api/FeaturesApi';
import AccessApi from '~/api/AccessApi';
import { IAccess } from '~/types/Access';
import { handleApiResponse } from '~/utils/handleApiResponse';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    try {
        const orgName = await getSelectedOrganization(request);
        const adapterName = params.name;

        const [adapters, components, features] = await Promise.all([
            AdapterApi.getAdapters(orgName),
            ComponentApi.getOrganisationComponents(orgName),
            FeaturesApi.fetchFeatures(),
        ]);

        let access;
        if (adapterName && features['access-controll-new']) {
            access = await AccessApi.getClientorAdapterAccess(adapterName);
        }

        return json({ adapters, components, features, access, orgName });
    } catch (error) {
        console.error('Error fetching data:', error);

        throw new Response('Kunne ikke laste data. Vennligst prøv igjen senere.', { status: 500 });
    }
};

export const meta: MetaFunction = () => {
    return [{ title: 'Adapter Detaljer' }, { name: 'description', content: 'Adapter Detaljer' }];
};

export default function Index() {
    // TODO: get adapter based on ID.
    const { adapters, features, access } = useLoaderData<{
        adapters: IAdapter[];
        features: Record<string, boolean>;
        access: IAccess[];
    }>();

    const { name } = useParams();
    const hasAccessControl = features['access-controll-new'];
    const breadcrumbs = [
        { name: 'Adaptere', link: '/adaptere' },
        { name: `${name}`, link: `/adapter/${name}` },
    ];

    const filteredAdapters = adapters.filter((a) => a.name === name);

    const adapter = filteredAdapters.length > 0 ? filteredAdapters[0] : null;

    const displayName = adapter?.name.split('@')[0] || '';

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={displayName}
                icon={MigrationIcon}
                helpText="adapter detaljer"
            />
            {!adapter && (
                <InfoBox
                    message={`Det finnes ingen adapter ved navn ${name} i listen over adaptere`}
                />
            )}

            {adapter && (
                <AdapterDetail
                    adapter={adapter}
                    hasAccessControl={hasAccessControl}
                    access={access}
                />
            )}
        </>
    );
}

export async function action({ request, params }: ActionFunctionArgs) {
    const name = params.name;

    if (!name) {
        return json({ error: 'No adapter name in params' }, { status: 400 });
    }

    const formData = await request.formData();
    const orgName = await getSelectedOrganization(request);
    const actionType = formData.get('actionType') as string;

    let response;
    let updateResponse;
    switch (actionType) {
        case 'UPDATE_PASSWORD':
            updateResponse = await AdapterApi.setPassword(
                formData.get('entityName') as string,
                formData.get('password') as string,
                orgName
            );
            response = handleApiResponse(updateResponse, 'Ressurser password oppdatert');
            break;
        case 'GET_SECRET':
            updateResponse = await AdapterApi.getOpenIdSecret(
                formData.get('adapterName') as string,
                orgName
            );
            return json({
                clientSecret: await updateResponse,
                message: 'Adapter secret fetched successfully',
                variant: 'success',
                show: true,
            });
        default:
            return json({
                show: true,
                message: `Unknown action type '${actionType}'`,
                variant: 'error',
            });
    }
    return json(response);
}
