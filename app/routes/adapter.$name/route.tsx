import {
    type LoaderFunctionArgs,
    json,
    type MetaFunction,
    type ActionFunctionArgs,
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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const orgName = await getSelectedOrganization(request);

    const adapters = await AdapterAPI.getAdapters(orgName);
    const components = await ComponentApi.getAllComponents();

    return json({ adapters, components });
};

export const meta: MetaFunction = () => {
    return [{ title: 'Adapter Detaljer' }, { name: 'description', content: 'Adapter Detaljer' }];
};

export default function Index() {
    // TODO: get adapter based on ID.
    const { adapters } = useLoaderData<{ adapters: IAdapter[] }>();

    const { name } = useParams();

    const breadcrumbs = [
        { name: 'Adaptere', link: '/adaptere' },
        { name: `${name}`, link: `/adapter/${name}` },
    ];

    const filteredAdapters = adapters.filter((a) => a.name === name);
    if (filteredAdapters.length > 0) {
    }

    const adapter = filteredAdapters.length > 0 ? filteredAdapters[0] : null;

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={(adapter && adapter?.shortDescription) || 'No adapter found'}
                icon={MigrationIcon}
                helpText="adapter detaljer"
            />
            {!adapter && (
                <InfoBox
                    message={`Det finnes ingen adapter ved navn ${name} i listen over adaptere`}
                />
            )}

            {adapter && <AdapterDetail adapter={adapter} />}
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
