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
import adapters from '~/routes/adaptere/adapterList.json';
import { AdapterDetail } from './AdapterDetail';
import { IUserSession } from '~/types/types';
import { getSession } from '~/utils/session';
import { ErrorBox } from '~/components/shared/ErrorBox';
import { fetchClientSecret } from './actions';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get('Cookie'));
    const userSession: IUserSession | undefined = session.get('user-session');

    if (!userSession) {
        throw new Response('Unauthorized', { status: 401 });
    }

    return json({ userSession });
};

export const meta: MetaFunction = () => {
    return [{ title: 'Adapter Detaljer' }, { name: 'description', content: 'Adapter Detaljer' }];
};

export default function Index() {
    const { userSession } = useLoaderData<{
        userSession: IUserSession;
    }>();

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

            {!userSession && <ErrorBox message="User session is null" />}
            {adapter && userSession && userSession.selectedOrganization && (
                <AdapterDetail
                    adapter={adapter}
                    organisationName={userSession.selectedOrganization.name}
                />
            )}
        </>
    );
}

export async function action({ request }: ActionFunctionArgs) {
    // console.log('request action ', request);

    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const name = searchParams.get('name');

    if (!name) {
        return json({ error: 'No adapter name in action' }, { status: 400 });
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
    console.log('');
    console.log('client secret: ');
    console.log(response);
    console.log('');

    return response;
}
