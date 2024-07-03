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
import { useState } from 'react';

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

function ListItem({ adapter, onClick }: { adapter: IAdapter; onClick: () => void }) {
    return (
        <Box
            onClick={onClick}
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

function AdapterList({
    items,
    onItemClick,
}: {
    items: IAdapter[];
    onItemClick: (adapter: IAdapter) => void;
}) {
    return (
        <VStack gap="5">
            {items.map((adapter, index) => (
                <ListItem key={index} adapter={adapter} onClick={() => onItemClick(adapter)} />
            ))}
        </VStack>
    );
}

function AdapterDetail({ adapter }: { adapter: IAdapter }) {
    return (
        <Box padding="6" borderRadius="large" shadow="small" background="surface-subtle">
            <HStack>
                <Label>Client ID:</Label>
                <BodyLong>{adapter.clientId}</BodyLong>
            </HStack>
            <HStack>
                <Label>Note:</Label>
                <BodyLong>{adapter.note}</BodyLong>
            </HStack>
            <HStack>
                <Label>Assets:</Label>
                <BodyLong>{adapter.assets.join(', ')}</BodyLong>
            </HStack>
            {/* Add more fields as needed */}
        </Box>
    );
}

function Tab({ value, adapters }: { value: string; adapters: IAdapter[] }) {
    const [selectedAdapter, setSelectedAdapter] = useState<IAdapter | null>(null);

    return (
        <Tabs.Panel value={value} className="w-full p-10">
            {selectedAdapter && <AdapterDetail adapter={selectedAdapter} />}
            {!selectedAdapter && <AdapterList items={adapters} onItemClick={setSelectedAdapter} />}
        </Tabs.Panel>
    );
}
export default function Index() {
    const breadcrumbs = [{ name: 'Adapter', link: '/adapter' }];

    const { adapters } = useLoaderData<IPageLoaderData>();

    const tabInfo = [
        {
            value: 'manuelt-opprettet',
            label: 'Manuelt opprettet',
        },
        {
            value: 'automatisk-opprettet',
            label: 'Automatisk opprettet',
        },
    ];
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
                <Tabs defaultValue={tabInfo[0].value} fill>
                    <Tabs.List>
                        <Tabs.Tab
                            value={tabInfo[0].value}
                            label={tabInfo[0].label}
                            icon={<NotePencilDashIcon title={tabInfo[0].label} aria-hidden />}
                        />
                        <Tabs.Tab
                            value={tabInfo[1].value}
                            label={tabInfo[1].label}
                            icon={<CogRotationIcon title={tabInfo[0].label} aria-hidden />}
                        />
                    </Tabs.List>
                    {tabInfo.map((tab, index) => (
                        <Tab
                            value={tab.value}
                            adapters={
                                index === 1
                                    ? adapters.filter((adapter) => adapter.managed)
                                    : adapters.filter((adapter) => !adapter.managed)
                            }
                        />
                    ))}
                </Tabs>
            )}
        </>
    );
}
