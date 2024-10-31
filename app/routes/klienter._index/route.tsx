import React, { useEffect, useState } from 'react';
import { json, useFetcher, useLoaderData, useSearchParams } from '@remix-run/react';
import ClientApi from '~/api/ClientApi';
import { IClient, IPartialClient } from '~/types/Clients';
import ClientTable from '~/routes/klienter._index/ClientTable';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { PlusIcon, TokenIcon } from '@navikt/aksel-icons';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { Alert, Button, HStack, Search, Tabs, VStack } from '@navikt/ds-react';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { type ActionFunctionArgs, LoaderFunction, MetaFunction, redirect } from '@remix-run/node';
import ClientCreateForm from '~/routes/klienter._index/CreateForm';
import { IFetcherResponseData } from '~/types/types';
import logger from '~/utils/logger';

export const meta: MetaFunction = () => {
    return [{ title: 'Klienter' }, { name: 'description', content: 'klienter' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);

    const clientData = await ClientApi.getClients(orgName);
    return json({ clientData, orgName });
};

interface IPageLoaderData {
    clientData: IClient[];
    orgName: string;
}
export default function Index() {
    const { clientData, orgName } = useLoaderData<IPageLoaderData>();
    const breadcrumbs = [{ name: 'Klienter', link: '/klienter' }];
    const [isManaged, setIsManaged] = useState('false');
    const [filteredClients, setFilteredClients] = useState(clientData);
    const [searchParams] = useSearchParams();
    const deleteName = searchParams.get('deleted');
    // const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);
    const [show, setShow] = React.useState(false);
    const fetcher = useFetcher<IFetcherResponseData>();
    const actionData = fetcher.data as IFetcherResponseData;
    useEffect(() => {
        setShow(true);
    }, [fetcher.state]);

    useEffect(() => {
        setFilteredClients(clientData.filter((client) => !client.managed));
    }, [clientData]);

    function handleTabClick(newValue: string) {
        setIsManaged(newValue);
        if (newValue === 'true') {
            setFilteredClients(clientData.filter((client) => client.managed));
        } else {
            setFilteredClients(clientData.filter((client) => !client.managed));
        }
    }

    const handleCreate = () => {
        // navigate(`/klienter._index/create`);
        setIsCreating(true);
    };

    const handleSearch = (value: string) => {
        const query = value.toLowerCase();
        setFilteredClients(
            clientData.filter(
                (client) =>
                    client.name.toLowerCase().includes(query) ||
                    client.shortDescription.toLowerCase().includes(query)
            )
        );
    };

    function handleCancelCreate() {
        setIsCreating(false);
        setShow(false);
    }

    const handleSave = (formData: FormData) => {
        fetcher.submit(formData, { method: 'post', action: '/klienter' });
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            {isCreating ? (
                <ClientCreateForm
                    onCancel={handleCancelCreate}
                    onSave={handleSave}
                    orgName={orgName}
                />
            ) : (
                <>
                    <HStack align={'center'} justify={'space-between'}>
                        <VStack>
                            <InternalPageHeader
                                title={'Klienter'}
                                icon={TokenIcon}
                                helpText="klienter"
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

                    {(actionData && show) || (show && deleteName) ? (
                        <Alert
                            className={'!mt-5 mb-10'}
                            variant={
                                (actionData?.variant || 'success') as
                                    | 'error'
                                    | 'info'
                                    | 'warning'
                                    | 'success'
                            }
                            closeButton
                            onClose={() => setShow(false)}>
                            {actionData?.message ||
                                `Klient '${deleteName}' har blitt slettet` ||
                                'Innhold'}
                        </Alert>
                    ) : null}

                    <Search
                        label="Søk etter klienter"
                        hideLabel
                        variant="secondary"
                        size="small"
                        onChange={(value: string) => handleSearch(value)}
                        placeholder="Søk etter navn eller beskrivelse"
                        className={'pb-6'}
                    />

                    <Tabs
                        value={isManaged}
                        onChange={handleTabClick}
                        fill={true}
                        aria-label="hvordan-client-er-opprettet">
                        <Tabs.List>
                            <Tabs.Tab value="false" label="Manuelt opprettet" />
                            <Tabs.Tab value="true" label="Automatisk opprettet" />
                        </Tabs.List>
                    </Tabs>

                    <ClientTable clients={filteredClients} />
                </>
            )}
        </>
    );
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const note = formData.get('note') as string;
    const orgName = await getSelectedOrganization(request);

    const newClient: IPartialClient = {
        name: name,
        note: note,
        shortDescription: description,
    };

    const response = await ClientApi.createClient(newClient, orgName);

    logger.debug(`.... Response Client Create: ${JSON.stringify(response)}`);
    logger.debug('Response client name:', response.name);

    if (response.name) {
        return redirect(`/klienter/${response.name}`);
    } else {
        return json({
            errors: {
                apiError: `Feil oppretting av klient. Responsen inneholder ikke navn.`,
            },
        });
    }
}
