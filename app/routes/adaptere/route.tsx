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
import { useState } from 'react';
import adapters from '~/routes/adaptere/adapterList.json';
import { tabInfo } from './constants';
import { AdapterList } from './AdapterList';
import { AdapterDetail } from '../adapter.$name/AdapterDetail';
import { ArrowLeftIcon } from '@navikt/aksel-icons';

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

        return json({ adapters });

        throw new Response('Not Found', { status: 404 });
    }
};

function Tab({ value, adapters }: { value: string; adapters: IAdapter[] }) {
    return (
        <Tabs.Panel value={value} className="w-full p-10">
            <AdapterList items={adapters} />
        </Tabs.Panel>
    );
}

export default function Index() {
    const breadcrumbs = [{ name: 'Adaptere', link: '/adaptere' }];

    const { adapters } = useLoaderData<IPageLoaderData>();

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={'Adaptere'}
                icon={MigrationIcon}
                helpText="adaptere"
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
                            key={index}
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
