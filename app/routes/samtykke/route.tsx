import { PassportIcon, PlusIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, HStack, VStack } from '@navikt/ds-react';
import { type ApiResponse } from 'novari-frontend-components';
import { useEffect, useState } from 'react';
import { type ActionFunctionArgs, type MetaFunction, useFetcher, useLoaderData } from 'react-router';

import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { handleConsentAction } from '~/routes/samtykke/actions';
import AddPolicyForm from '~/routes/samtykke/AddPolicyForm';
import AddServiceForm from '~/routes/samtykke/AddServiceForm';
import ServiceTable from '~/routes/samtykke/ServiceTable';
import { IBehandling, IBehandlingsgrunnlag, IPersonopplysning, ITjeneste } from '~/types/Consent';

import { loader } from './loaders';


export const meta: MetaFunction = () => {
    return [{ title: 'Samtykke' }, { name: 'description', content: 'Samtykke' }];
};

export { loader };

export const action = async (args: ActionFunctionArgs) => handleConsentAction(args);

export default function Index() {
    const [showAddPolicyForm, setShowAddPolicyForm] = useState(false);
    const [showAddServiceForm, setShowAddServiceForm] = useState(false);
    const breadcrumbs = [{ name: 'Samtykke', link: '/samtykke' }];

    const fetcher = useFetcher<ApiResponse<never>>();
    // const actionData = fetcher.data as ApiResponse<any>;
    // const { alertState } = useAlerts<never>([], actionData, fetcher.state);

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
            {/*<NovariSnackbar*/}
            {/*    items={alertState}*/}
            {/*    position={'top-right'}*/}
            {/*    // onCloseItem={handleCloseItem}*/}
            {/*/>*/}

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
