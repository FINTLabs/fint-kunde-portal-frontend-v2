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
import AdapterAPI from '~/api/AdapterApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { fetchClientSecret } from '../../components/shared/actions/autentiseringActions';
import { InfoBox } from '~/components/shared/InfoBox';
import FeaturesApi from '~/api/FeaturesApi';
import { IComponent } from '~/types/Component';
import AccessApi from '~/api/AccessApi';
import { IAccess } from '~/types/Access';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const orgName = await getSelectedOrganization(request);

    const adapterName = params.name;
    let access;
    if (adapterName) {
        access = await AccessApi.getAccess(adapterName);
    }
    const adapters = await AdapterAPI.getAdapters(orgName);
    const components = await ComponentApi.getOrganisationComponents(orgName);
    const features = await FeaturesApi.fetchFeatures();

    return json({ adapters, components, features, access });
};

export const meta: MetaFunction = () => {
    return [{ title: 'Adapter Detaljer' }, { name: 'description', content: 'Adapter Detaljer' }];
};

export default function Index() {
    // TODO: get adapter based on ID.
    const { adapters, components, features, access } = useLoaderData<{
        adapters: IAdapter[];
        components: IComponent[];
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
    if (actionType === 'Passord') {
        const response = 'Not implemented';
        return response;
    } else {
        const response = await fetchClientSecret(name, orgName);
        return response;
    }
}
