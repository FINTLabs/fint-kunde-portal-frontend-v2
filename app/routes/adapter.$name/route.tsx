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
import { IAdapter, IUserSession } from '~/types/types';
import { getSession } from '~/utils/session';
import { ErrorBox } from '~/components/shared/ErrorBox';
import { fetchClientSecret } from './actions';
import ComponentApi from '~/api/ComponentApi';
import AdapterAPI from '~/api/AdapterApi';
import { getSelectedOprganization } from '~/utils/selectedOrganization';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const orgName = await getSelectedOprganization(request);

    const adapters = await AdapterAPI.getAdapters(orgName);
    const components = await ComponentApi.getAllComponents();

    return json({ adapters, components, orgName });
};

export const meta: MetaFunction = () => {
    return [{ title: 'Adapter Detaljer' }, { name: 'description', content: 'Adapter Detaljer' }];
};

export default function Index() {
    const { adapters, orgName } = useLoaderData<{ adapters: IAdapter[]; orgName: string }>();

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
                <ErrorBox
                    message={`Det finnes ingen adapter ved navn ${name} i listen over adaptere`}
                />
            )}

            {adapter && <AdapterDetail adapter={adapter} organisationName={orgName} />}
        </>
    );
}

export async function action({ request, params }: ActionFunctionArgs) {
    const name = params.name;

    if (!name) {
        return json({ error: 'No adapter name in params' }, { status: 400 });
    }

    const session = await getSession(request.headers.get('Cookie'));
    const userSession: IUserSession | undefined = session.get('user-session');

    // TODO: find a better way to grab session;
    if (!userSession) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!userSession.selectedOrganization) {
        return json({ error: 'Selected Organization' }, { status: 400 });
    }

    const response = await fetchClientSecret(name, userSession.selectedOrganization?.name);
    return response;
}
