import React, { useEffect, useState } from 'react';
import { PlusIcon, TerminalIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, HStack, VStack } from '@navikt/ds-react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import ServiceTable from '~/routes/samtykke/ServiceTable';
import AddServiceForm from '~/routes/samtykke/AddServiceForm';
import AddTjenesteForm from '~/routes/samtykke/AddTjenesteForm';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs, json } from '@remix-run/node';
import ConsentApi from '~/api/ConsentApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { IBehandling, IBehandlingsgrunnlag, IPersonopplysning, ITjeneste } from '~/types/Consent';
import { IFetcherResponseData } from '~/types/types';

export const loader = async ({ request }: { request: Request }) => {
    const orgName = await getSelectedOrganization(request);

    try {
        const processedConsents = await ConsentApi.getBehandlings(orgName);
        const services = await ConsentApi.getTjenste(orgName);
        const personalDataList = await ConsentApi.getPersonopplysning();
        const foundations = await ConsentApi.getBehandlingsgrunnlag();
        return json({
            processedConsents: processedConsents,
            services: services,
            personalDataList: personalDataList,
            foundations: foundations,
        });
    } catch (error) {
        console.error('Error fetching data HELLO:', error);
        return json({ error: 'An error occurred while fetching data.' }, { status: 200 });
    }
};

export async function action({ request }: ActionFunctionArgs) {
    const orgName = await getSelectedOrganization(request);
    const formData = await request.formData();

    const serviceId = String(formData.get('serviceId'));
    const isActive = String(formData.get('isActive'));
    const actionType = formData.get('actionType');

    console.log('INSIDE ACTION --------------------------');
    let response;
    switch (actionType) {
        case 'setIsActive':
            response = await ConsentApi.setActive(orgName, serviceId, isActive);
            break;
        case 'addService':
            console.log('ADDING NEW SERVICE');
            break;
        default:
            return json({ show: true, message: 'Unknown action type', variant: 'error' });
    }

    return json({ show: true, message: response?.message, variant: response?.variant });
}

export default function Index() {
    const [showAddServiceForm, setShowAddServiceForm] = useState(false);
    const [showAddTjenesteForm, setShowAddTjenesteForm] = useState(false);
    const fetcher = useFetcher();
    const actionData = fetcher.data as IFetcherResponseData;
    const [show, setShow] = React.useState(false);
    // console.log(actionData);
    const breadcrumbs = [{ name: 'Samtykke', link: '/samtykke' }];
    const { processedConsents, services, personalDataList, foundations, error } = useLoaderData<{
        processedConsents: IBehandling[];
        services: ITjeneste[];
        personalDataList: IPersonopplysning[];
        foundations: IBehandlingsgrunnlag[];
        error?: string;
    }>();

    useEffect(() => {
        setShow(true);
    }, [fetcher.state]);

    const handleAddServiceClick = () => {
        setShowAddServiceForm(true);
        setShowAddTjenesteForm(false);
        setShow(false);
    };

    const handleAddTjenesteClick = () => {
        setShowAddTjenesteForm(true);
        setShowAddServiceForm(false);
        setShow(false);
    };

    const handleCancelClick = () => {
        setShowAddServiceForm(false);
        setShowAddTjenesteForm(false);
        setShow(false);
    };

    const handleSaveService = (formData: {
        selectedPersonalData: string;
        selectedFoundation: string;
        selectedService: string;
    }) => {
        console.log('Saved service data:', formData);
        setShowAddServiceForm(false);

        fetcher.submit(formData);
    };

    const handleSaveTjeneste = (formData: { tjenesteNavn: string; tjenesteKode: string }) => {
        console.log('Saved tjeneste data:', formData);
        setShowAddTjenesteForm(false);
        fetcher.submit(formData, { method: 'post', action: '/samtykke' });
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <HStack align={'center'} justify={'space-between'}>
                <VStack>
                    <InternalPageHeader
                        title={'Samtykke'}
                        icon={TerminalIcon}
                        helpText="samtykke"
                    />
                </VStack>
                <VStack gap={'3'}>
                    {!error && !showAddServiceForm && !showAddTjenesteForm && (
                        <>
                            <Button
                                size="small"
                                icon={<PlusIcon aria-hidden />}
                                onClick={handleAddServiceClick}>
                                Nytt samtykke
                            </Button>
                            <Button
                                size="small"
                                icon={<PlusIcon aria-hidden />}
                                onClick={handleAddTjenesteClick}>
                                Ny tjeneste
                            </Button>
                        </>
                    )}
                </VStack>
            </HStack>

            {actionData && show && (
                <Alert
                    className={'!mt-5'}
                    variant={actionData.variant as 'error' | 'info' | 'warning' | 'success'}
                    closeButton
                    onClose={() => setShow(false)}>
                    {actionData.message || 'Content'}
                </Alert>
            )}

            <VStack gap={'6'}>
                <Box className="w-full" padding="6">
                    {error && (
                        <Alert variant="error">Error - feil ved tilkobling til server.</Alert>
                    )}
                    {showAddServiceForm && (
                        <AddServiceForm
                            personalData={personalDataList}
                            foundation={foundations}
                            service={services}
                            onCancel={handleCancelClick}
                            f={fetcher}
                        />
                    )}
                    {showAddTjenesteForm && (
                        <fetcher.Form method="post">
                            {/*<input type={'hidden'} name={'actionType'} value={'addService'} />*/}
                            <AddTjenesteForm
                                onCancel={handleCancelClick}
                                onSave={handleSaveTjeneste}
                                // f={fetcher}
                            />
                        </fetcher.Form>
                    )}
                    {!showAddServiceForm && !showAddTjenesteForm && !error && (
                        <ServiceTable
                            processedConsents={processedConsents}
                            services={services}
                            personalDataList={personalDataList}
                            foundations={foundations}
                            f={fetcher}
                        />
                    )}
                </Box>
            </VStack>
        </>
    );
}
