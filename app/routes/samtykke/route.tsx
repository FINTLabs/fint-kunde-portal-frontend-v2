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
import AddPolicyForm from '~/routes/samtykke/AddPolicyForm';
import AddServiceForm from '~/routes/samtykke/AddServiceForm';
import FeaturesApi from '~/api/FeaturesApi';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import AlertManager from '~/components/AlertManager';
import useAlerts from '~/components/useAlerts';

export const meta: MetaFunction = () => {
    return [{ title: 'Samtykke' }, { name: 'description', content: 'Samtykke' }];
};

export const loader = async ({ request }: { request: Request }) => {
    const orgName = await getSelectedOrganization(request);
    const featuresResponse = await FeaturesApi.fetchFeatures();
    const features = featuresResponse?.data;

    if (features && features['samtykke-admin-new']) {
        const policies = await ConsentApi.getBehandlings(orgName);
        const services = await ConsentApi.getTjenste(orgName);
        const personalDataList = await ConsentApi.getPersonopplysning();
        const foundations = await ConsentApi.getBehandlingsgrunnlag();

        return new Response(
            JSON.stringify({
                policies: policies.data,
                services: services.data,
                personalDataList: personalDataList.data,
                foundations: foundations.data,
            }),
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    // TODO: display no access?
    return json({});
};

export default function Index() {
    const [showAddPolicyForm, setShowAddPolicyForm] = useState(false);
    const [showAddServiceForm, setShowAddServiceForm] = useState(false);
    const breadcrumbs = [{ name: 'Samtykke', link: '/samtykke' }];

    const fetcher = useFetcher<IFetcherResponseData>();
    const actionData = fetcher.data as IFetcherResponseData;
    const { alerts } = useAlerts(actionData, fetcher.state);

    const { policies, services, personalDataList, foundations, error } = useLoaderData<{
        policies: IBehandling[];
        services: ITjeneste[];
        personalDataList: IPersonopplysning[];
        foundations: IBehandlingsgrunnlag[];
        error?: string;
    }>();

    useEffect(() => {}, [fetcher.state]);

    const handleAddConsentClick = () => {
        setShowAddPolicyForm(true);
        setShowAddServiceForm(false);
    };

    const handleAddServiceClick = () => {
        setShowAddServiceForm(true);
        setShowAddPolicyForm(false);
    };

    const handleCancelClick = () => {
        setShowAddPolicyForm(false);
        setShowAddServiceForm(false);
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
            <AlertManager alerts={alerts} />

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
    let response;
    switch (actionType) {
        case 'SET_ACTIVE':
            response = await ConsentApi.setActive(
                orgName,
                formData.get('policyId') as string,
                formData.get('setIsActive') as string
            );
            break;
        case 'ADD_SERVICE':
            serviceName = formData.get('newServiceName') as string;
            response = await ConsentApi.createService(serviceName, orgName);
            break;
        case 'ADD_POLICY':
            response = await ConsentApi.createPolicy(
                formData.get('serviceId') as string,
                formData.get('foundationId') as string,
                formData.get('personalDataId') as string,
                formData.get('description') as string,
                orgName
            );
            break;
        default:
            response = {
                success: false,
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            };
    }

    return response;
}
