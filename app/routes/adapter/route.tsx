import { json, type LoaderFunction, type MetaFunction } from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { MigrationIcon } from '@navikt/aksel-icons';
import { Box, Tabs } from '@navikt/ds-react';
import { CogRotationIcon } from '@navikt/aksel-icons';
import { NotePencilDashIcon } from '@navikt/aksel-icons';
import { log } from '~/utils/logger';
import { getSession } from '~/utils/session';
import AdapterAPI from '~/api/AdapterApi';
import { useLoaderData } from '@remix-run/react';
import { IAdapter } from '~/types/types';

interface IPageLoaderData {
    adapters?: IAdapter[];
}

export const meta: MetaFunction = () => {
    return [{ title: 'Adapter' }, { name: 'description', content: 'Liste over adapter' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    log('Request headers:', request.headers.get('x-nin'));

    try {
        const session = await getSession(request.headers.get('Cookie'));
        const userSession = session.get('user-session');

        const adapters = await AdapterAPI.getAdapters(userSession.selectedOrganization.name);

        return json({ adapters });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const breadcrumbs = [{ name: 'Adapter', link: '/adapter' }];

    const { adapters } = useLoaderData<IPageLoaderData>();

    console.log(adapters);
    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={'Adapter'}
                icon={MigrationIcon}
                helpText="adapter"
                hideBorder={true}
            />

            <Box>
                <Tabs defaultValue="manuelt-opprettet" fill>
                    <Tabs.List>
                        <Tabs.Tab
                            value="manuelt-opprettet"
                            label="Manuelt opprettet"
                            icon={<NotePencilDashIcon title="manuelt opprettet" aria-hidden />}
                        />
                        <Tabs.Tab
                            value="automatisk-opprettet"
                            label="Automatisk opprettet"
                            icon={<CogRotationIcon title="automatisk opprettet" aria-hidden />}
                        />
                    </Tabs.List>
                    <Tabs.Panel value="manuelt-opprettet" className="h-24 w-full bg-gray-50 p-4">
                        Logg-tab
                    </Tabs.Panel>
                    <Tabs.Panel value="automatisk-opprettet" className="h-24 w-full bg-gray-50 p-4">
                        Inbox-tab
                    </Tabs.Panel>
                </Tabs>
            </Box>
        </>
    );
}
