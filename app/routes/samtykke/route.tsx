import React, { useEffect, useState } from 'react';
import { PassportIcon, PlusIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, HStack, VStack } from '@navikt/ds-react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import ServiceTable from '~/routes/samtykke/ServiceTable';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs, json } from '@remix-run/node';
import ConsentApi from '~/api/ConsentApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { IBehandling, IBehandlingsgrunnlag, IPersonopplysning, ITjeneste } from '~/types/Consent';
import { IFetcherResponseData } from '~/types/types';
import AddPolicyForm from '~/routes/samtykke/AddPolicyForm';
import AddServiceForm from '~/routes/samtykke/AddServiceForm';

export const loader = async ({ request }: { request: Request }) => {
    const orgName = await getSelectedOrganization(request);

    try {
        const policies = await ConsentApi.getBehandlings(orgName);
        const services = await ConsentApi.getTjenste(orgName);
        const personalDataList = await ConsentApi.getPersonopplysning();
        const foundations = await ConsentApi.getBehandlingsgrunnlag();
        return json({
            policies: policies,
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

    console.log('INSIDE ACTION -------------------------->', actionType);
    let response;
    switch (actionType) {
        case 'setIsActive':
            response = await ConsentApi.setActive(orgName, serviceId, isActive);
            break;
        case 'addService':
            const newServiceName = String(formData.get('newServiceName'));
            response = await ConsentApi.createService(newServiceName, orgName);
            break;
        case 'addPolicy':
            console.log('adding a policy');
            break;
        default:
            return json({ show: true, message: 'Unknown action type', variant: 'error' });
    }

    return json({ show: true, message: response?.message, variant: response?.variant });
}

export default function Index() {
    const [showAddPolicyForm, setShowAddPolicyForm] = useState(false);
    const [showAddServiceForm, setShowAddServiceForm] = useState(false);
    const fetcher = useFetcher();
    const actionData = fetcher.data as IFetcherResponseData;
    const [show, setShow] = React.useState(false);
    // console.log(actionData);
    const breadcrumbs = [{ name: 'Samtykke', link: '/samtykke' }];
    const { policies, services, personalDataList, foundations, error } = useLoaderData<{
        policies: IBehandling[];
        services: ITjeneste[];
        personalDataList: IPersonopplysning[];
        foundations: IBehandlingsgrunnlag[];
        error?: string;
    }>();

    useEffect(() => {
        setShow(true);
    }, [fetcher.state]);

    const handleAddConsentClick = () => {
        setShowAddPolicyForm(true);
        setShowAddServiceForm(false);
        setShow(false);
    };

    const handleAddServiceClick = () => {
        setShowAddServiceForm(true);
        setShowAddPolicyForm(false);
        setShow(false);
    };

    const handleCancelClick = () => {
        setShowAddPolicyForm(false);
        setShowAddServiceForm(false);
        setShow(false);
    };

    const handleSavePolicy = (formData: {
        selectedPersonalData: string;
        selectedFoundation: string;
        selectedService: string;
        note: string;
    }) => {
        console.log('Saved service data:', formData);
        setShowAddPolicyForm(false);

        const updatedFormData = { ...formData, actionType: 'addPolicy' };
        fetcher.submit(updatedFormData, { method: 'post', action: '/samtykke' });
    };

    const handleSaveService = (formData: { newServiceName: string }) => {
        setShowAddServiceForm(false);

        const updatedFormData = { ...formData, actionType: 'addService' };
        fetcher.submit(updatedFormData, { method: 'post', action: '/samtykke' });
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <HStack align={'center'} justify={'space-between'}>
                <VStack>
                    <InternalPageHeader
                        title={'Samtykke'}
                        icon={PassportIcon}
                        helpText="samtykke"
                    />
                </VStack>
                <VStack gap={'3'}>
                    {!error && !showAddPolicyForm && !showAddServiceForm && (
                        <>
                            <Button
                                size="small"
                                icon={<PlusIcon aria-hidden />}
                                onClick={handleAddConsentClick}>
                                Nytt samtykke
                            </Button>
                            <Button
                                size="small"
                                icon={<PlusIcon aria-hidden />}
                                onClick={handleAddServiceClick}>
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
                    {showAddPolicyForm && (
                        <AddPolicyForm
                            personalData={personalDataList}
                            foundation={foundations}
                            service={services}
                            onCancel={handleCancelClick}
                            onSave={handleSavePolicy}
                        />
                    )}
                    {showAddServiceForm && (
                        <AddServiceForm onCancel={handleCancelClick} onSave={handleSaveService} />
                    )}
                    {!showAddPolicyForm && !showAddServiceForm && !error && (
                        <ServiceTable
                            policies={policies}
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
