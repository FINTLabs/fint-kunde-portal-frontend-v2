import { json, type LoaderFunction, type MetaFunction } from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { MigrationIcon } from '@navikt/aksel-icons';
import { Button, HStack, Tabs, VStack } from '@navikt/ds-react';
import { CogRotationIcon } from '@navikt/aksel-icons';
import { NotePencilDashIcon } from '@navikt/aksel-icons';
import { log } from '~/utils/logger';
import { getSession } from '~/utils/session';
import AdapterAPI from '~/api/AdapterApi';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { IAdapter } from '~/types/types';
import { tabInfo } from './constants';
import { AdapterList } from './AdapterList';
import { ErrorBox } from '~/components/shared/ErrorBox';
import { PlusIcon } from '@navikt/aksel-icons';
import mockAdapters from './adapterList.json';
import { getSelectedOprganization } from '~/utils/selectedOrganization';

interface IPageLoaderData {
    adapters?: IAdapter[];
}

export const meta: MetaFunction = () => {
    return [{ title: 'Adapter' }, { name: 'description', content: 'Liste over adapter' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    log('Request headers:', request.headers.get('x-nin'));
    const orgName = await getSelectedOprganization(request);
    const adapters = await AdapterAPI.getAdapters(orgName);
    return json({ adapters: adapters, orgName });
};

function Tab({ value, adapters }: { value: string; adapters: IAdapter[] }) {
    return (
        <Tabs.Panel value={value} className="w-full">
            <AdapterList items={adapters} />
        </Tabs.Panel>
    );
}
export default function Index() {
    const breadcrumbs = [{ name: 'Adaptere', link: '/adaptere' }];

    const { adapters } = useLoaderData<IPageLoaderData>();

    const navigate = useNavigate();

    const handleCreate = () => {
        navigate(`/adapter/create`);
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <HStack align={'center'} justify={'space-between'}>
                <VStack>
                    <InternalPageHeader
                        title={'Adaptere'}
                        icon={MigrationIcon}
                        helpText="adaptere"
                    />
                </VStack>
                <VStack>
                    <Button
                        className="float-right"
                        onClick={handleCreate}
                        icon={<PlusIcon aria-hidden />}>
                        Legg til
                    </Button>
                </VStack>
            </HStack>

            {!adapters && <ErrorBox message="Fant ingen adaptere" />}

            {adapters && (
                <>
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
                </>
            )}
        </>
    );
}
