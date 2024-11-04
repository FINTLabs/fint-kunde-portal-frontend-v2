import React, { useEffect, useState } from 'react';
import { PassportIcon, PlusIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, HStack, VStack } from '@navikt/ds-react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import ServiceTable from '~/routes/samtykke/ServiceTable';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs, json, MetaFunction } from '@remix-run/node';
import ConsentApi from '~/api/ConsentApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { IBehandling, IBehandlingsgrunnlag, IPersonopplysning, ITjeneste } from '~/types/Consent';
import { IFetcherResponseData } from '~/types/types';
import AddPolicyForm from '~/routes/samtykke/AddPolicyForm';
import AddServiceForm from '~/routes/samtykke/AddServiceForm';
import FeaturesApi from '~/api/FeaturesApi';
import { handleApiResponse } from '~/utils/handleApiResponse';

export const meta: MetaFunction = () => {
    return [{ title: 'Samtykke' }, { name: 'description', content: 'Samtykke' }];
};

export const loader = async ({ request }: { request: Request }) => {
    const orgName = await getSelectedOrganization(request);

    try {
        const features = await FeaturesApi.fetchFeatures();
        console.debug('...........', features['samtykke-admin-new']);
        if (features['samtykke-admin-new']) {
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
        } else {
            return json(
                { error: 'Det oppsto en feil ved henting av data: Tilgang nektet' },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error('Feil ved henting av data:', error);
        // throw json({ error: 'Det oppsto en feil ved henting av data.' }, { status: 200 });
        throw new Response('Det oppsto en feil ved henting av data.', { status: 500 });
    }
};

export default function Index() {
    const [showAddPolicyForm, setShowAddPolicyForm] = useState(false);
    const [showAddServiceForm, setShowAddServiceForm] = useState(false);
    const fetcher = useFetcher<IFetcherResponseData>();
    const actionData = fetcher.data as IFetcherResponseData;
    const [show, setShow] = React.useState(false);

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
        personalDataId: string;
        foundationId: string;
        serviceId: string;
        description: string;
    }) => {
        setShowAddPolicyForm(false);

        const updatedFormData = { ...formData, actionType: 'ADD_POLICY' };
        fetcher.submit(updatedFormData, { method: 'post', action: '/samtykke' });
    };

    const handleSaveService = (formData: { newServiceName: string }) => {
        setShowAddServiceForm(false);

        const updatedFormData = { ...formData, actionType: 'ADD_SERVICE' };
        fetcher.submit(updatedFormData, { method: 'post', action: '/samtykke' });
    };

    const handleActiveToggle = (formData: { policyId: string; setIsActive: string }) => {
        // setShowAddServiceForm(false);

        // actionType="SET_ACTIVE"
        const updatedFormData = { ...formData, actionType: 'SET_ACTIVE' };
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
                    {actionData.message || 'Innhold'}
                </Alert>
            )}

            <VStack gap={'6'}>
                <Box className="w-full" padding="6">
                    {error && <Alert variant="warning">{error}</Alert>}
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
                            onActiveToggle={handleActiveToggle}
                        />
                    )}
                </Box>
            </VStack>
        </>
    );
}

export async function action({ request }: ActionFunctionArgs) {
    const orgName = await getSelectedOrganization(request);
    const formData = await request.formData();
    const actionType = formData.get('actionType');

    let serviceName;
    // const handleApiResponse = (apiResponse: Response, successMessage: string) => {
    //     if (apiResponse.ok) {
    //         return {
    //             message: successMessage,
    //             variant: 'success',
    //             show: true,
    //         };
    //     } else {
    //         return {
    //             message: `Feil ved oppdatering. Mer info: Status: ${apiResponse.status}. StatusTekst: ${apiResponse.statusText}`,
    //             variant: 'error',
    //             show: true,
    //         };
    //     }
    // };

    let response;
    let updateResponse;
    switch (actionType) {
        case 'SET_ACTIVE':
            updateResponse = await ConsentApi.setActive(
                orgName,
                formData.get('policyId') as string,
                formData.get('setIsActive') as string
            );
            response = handleApiResponse(updateResponse, 'Aktiv status endret');
            break;
        case 'ADD_SERVICE':
            serviceName = formData.get('newServiceName') as string;
            updateResponse = await ConsentApi.createService(serviceName, orgName);
            response = handleApiResponse(updateResponse, `Ny tjeneste lagt til ${serviceName}`);
            break;
        case 'ADD_POLICY':
            updateResponse = await ConsentApi.createPolicy(
                formData.get('serviceId') as string,
                formData.get('foundationId') as string,
                formData.get('personalDataId') as string,
                formData.get('description') as string,
                orgName
            );
            response = handleApiResponse(updateResponse, `Nytt samtykke lagt til`);
            break;
        default:
            return json({ show: true, message: 'Ukjent handlingstype', variant: 'error' });
    }

    return json(response);
}
