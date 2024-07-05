import { json, type LoaderFunction, type MetaFunction } from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { MigrationIcon } from '@navikt/aksel-icons';
import {
    Button,
    FormSummary,
    HStack,
    Heading,
    Tabs,
    TextField,
    Textarea,
    VStack,
} from '@navikt/ds-react';
import { CogRotationIcon } from '@navikt/aksel-icons';
import { NotePencilDashIcon } from '@navikt/aksel-icons';
import { log } from '~/utils/logger';
import { getSession } from '~/utils/session';
import AdapterAPI from '~/api/AdapterApi';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { IAdapter } from '~/types/types';
import { tabInfo } from './constants';
import { AdapterList } from './AdapterList';
import { ErrorBox } from '../../components/shared/ErrorBox';
import { TrashIcon, PlusIcon } from '@navikt/aksel-icons';
import { useEffect, useState } from 'react';

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

    const [creatingAdapter, setIsCreatingAdapter] = useState(false);

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <HStack align={'center'} justify={'space-between'}>
                <VStack>
                    <InternalPageHeader
                        title={'Adaptere'}
                        icon={MigrationIcon}
                        helpText="adaptere"
                        hideBorder={true}
                    />
                </VStack>
                <VStack>
                    {!creatingAdapter && (
                        <Button
                            className="float-right"
                            onClick={() => {
                                setIsCreatingAdapter((prev) => !prev);
                            }}
                            icon={<PlusIcon aria-hidden />}>
                            Legg til
                        </Button>
                    )}
                </VStack>
            </HStack>

            {!adapters && <ErrorBox message="Fant ingen adaptere" />}

            {creatingAdapter === true && (
                <>
                    <FormSummary>
                        <FormSummary.Header>
                            <FormSummary.Heading level="2">Opprett ny adapter</FormSummary.Heading>
                            {/* <FormSummary.EditLink href="#" /> */}
                        </FormSummary.Header>

                        <FormSummary.Answers>
                            <FormSummary.Answer>
                                <HStack className="flex !items-end" gap="2">
                                    <TextField label="Navn" htmlSize={20} />
                                    <span className="pb-3.5">@adapter.fintlabs.no</span>
                                </HStack>
                            </FormSummary.Answer>

                            <FormSummary.Answer>
                                <TextField label="Kort beskrivelse" htmlSize={50} />
                            </FormSummary.Answer>

                            <FormSummary.Answer>
                                <Textarea label="Detaljert informasjon" />
                            </FormSummary.Answer>
                        </FormSummary.Answers>
                    </FormSummary>
                </>
            )}
            {!creatingAdapter && adapters && (
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
