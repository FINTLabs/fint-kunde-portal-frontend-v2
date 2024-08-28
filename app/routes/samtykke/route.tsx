import React, { useState } from 'react';
import { PlusIcon, TerminalIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, HStack, VStack } from '@navikt/ds-react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import ServiceTable from '~/routes/samtykke/ServiceTable';
import AddServiceForm from '~/routes/samtykke/AddServiceForm';
import AddTjenesteForm from '~/routes/samtykke/AddTjenesteForm';
import { useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs, json } from '@remix-run/node';
import ConsentApi from '~/api/ConsentApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { IBehandling, IBehandlingsgrunnlag, IPersonopplysning, ITjeneste } from '~/types/Consent';

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
    const formData = await request.formData();
    const behandlingId = String(formData.get('behandlingId'));
    console.log('save from form', behandlingId);
}

export default function Index() {
    const [showAddServiceForm, setShowAddServiceForm] = useState(false);
    const [showAddTjenesteForm, setShowAddTjenesteForm] = useState(false);

    const breadcrumbs = [{ name: 'Samtykke', link: '/samtykke' }];
    const { processedConsents, services, personalDataList, foundations, error } = useLoaderData<{
        processedConsents: IBehandling[];
        services: ITjeneste[];
        personalDataList: IPersonopplysning[];
        foundations: IBehandlingsgrunnlag[];
        error?: string;
    }>();

    const handleAddServiceClick = () => {
        setShowAddServiceForm(true);
        setShowAddTjenesteForm(false);
    };

    const handleAddTjenesteClick = () => {
        setShowAddTjenesteForm(true);
        setShowAddServiceForm(false);
    };

    const handleCancelClick = () => {
        setShowAddServiceForm(false);
        setShowAddTjenesteForm(false);
    };

    const handleSaveService = (formData: {
        selectedPersonalData: string;
        selectedFoundation: string;
        selectedService: string;
    }) => {
        console.log('Saved service data:', formData);
        setShowAddServiceForm(false);
        // Implement the logic to handle saving the service form data
    };

    const handleSaveTjeneste = (formData: { tjenesteNavn: string; tjenesteKode: string }) => {
        console.log('Saved tjeneste data:', formData);
        setShowAddTjenesteForm(false);
        // Implement the logic to handle saving the tjeneste form data
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
                            onSave={handleSaveService}
                        />
                    )}
                    {showAddTjenesteForm && (
                        <AddTjenesteForm onCancel={handleCancelClick} onSave={handleSaveTjeneste} />
                    )}
                    {!showAddServiceForm && !showAddTjenesteForm && !error && (
                        <ServiceTable
                            processedConsents={processedConsents}
                            services={services}
                            personalDataList={personalDataList}
                            foundations={foundations}
                        />
                    )}
                </Box>
            </VStack>
        </>
    );
}
