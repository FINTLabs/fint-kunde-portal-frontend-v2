import { json, type LoaderFunction, type MetaFunction } from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { MigrationIcon } from '@navikt/aksel-icons';
import { BodyLong, Box, HStack, Label, Tabs, VStack } from '@navikt/ds-react';
import { CogRotationIcon } from '@navikt/aksel-icons';
import { NotePencilDashIcon } from '@navikt/aksel-icons';
import { log } from '~/utils/logger';
import { getSession } from '~/utils/session';
import AdapterAPI from '~/api/AdapterApi';
import { useLoaderData } from '@remix-run/react';
import { IAdapter } from '~/types/types';
import { ChevronRightIcon } from '@navikt/aksel-icons';

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

function ListItem({ adapter }: { adapter: IAdapter }) {
    return (
        <Box
            className="hover:bg-[--a-surface-subtle] active:bg-[--a-surface-active] hover:cursor-pointer"
            borderRadius="large"
            shadow="xsmall"
            background="surface-transparent"
            padding="6">
            <HStack className="!flex !justify-between">
                <VStack>
                    <Label>{adapter.shortDescription}</Label>
                    <BodyLong>{adapter.name}</BodyLong>
                </VStack>
                <VStack className="!flex !justify-center pr-3">
                    <ChevronRightIcon title="Høyre peker" fontSize="1.7rem" />
                </VStack>
            </HStack>
        </Box>
    );
}

function AdapterList({ items }: { items: IAdapter[] }) {
    return (
        <VStack gap="5">
            {items.map((adapter, index) => (
                <ListItem key={index} adapter={adapter} />
            ))}
        </VStack>
    );
}

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

            {!adapters && (
                <Box padding="4" background="surface-danger-moderate">
                    Fant ingen adaptere
                </Box>
            )}
            {adapters && (
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
                    <Tabs.Panel value="manuelt-opprettet" className="w-full p-10">
                        <AdapterList items={adapters.filter((adapter) => !adapter.managed)} />
                    </Tabs.Panel>
                    <Tabs.Panel value="automatisk-opprettet" className="w-full p-10">
                        <AdapterList items={adapters.filter((adapter) => adapter.managed)} />
                    </Tabs.Panel>
                </Tabs>
            )}
        </>
    );
}
