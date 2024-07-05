import {
    type LoaderFunctionArgs,
    json,
    type LoaderFunction,
    type MetaFunction,
} from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { MigrationIcon } from '@navikt/aksel-icons';
import { useLoaderData, useParams } from '@remix-run/react';
import adapters from '~/routes/adaptere/adapterList.json';
import { BodyLong, Box, Chips } from '@navikt/ds-react';
import { AdapterDetail } from './AdapterDetail';
import { UserSession } from '~/types/types';
import { getSession } from '~/utils/session';
import { ErrorBox } from '~/components/shared/ErrorBox';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get('Cookie'));
    const userSession: UserSession | undefined = session.get('user-session');

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
        userSession: UserSession;
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
                hideBorder={true}
            />
            {!adapter && (
                <ErrorBox
                    message={`Det finnes ingen adapter ved navn ${name} i listen over adaptere`}
                />
            )}

            {(!userSession || userSession.selectedOrganization) && (
                <ErrorBox message="User session is null" />
            )}
            {adapter && userSession && userSession.selectedOrganization && (
                <AdapterDetail
                    adapter={adapter}
                    organisationName={userSession.selectedOrganization.name}
                />
            )}
        </>
    );
}
