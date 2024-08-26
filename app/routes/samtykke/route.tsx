import React, { useState } from 'react';
import { PlusIcon, TerminalIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack, VStack, Alert } from '@navikt/ds-react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import ServiceTable from '~/routes/samtykke/ServiceTable';
import AddServiceForm from '~/routes/samtykke/AddServiceForm';
import AddTjenesteForm from '~/routes/samtykke/AddTjenesteForm';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import ConsentApi from '~/api/ConsentApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { IBehandling, IBehandlingsgrunnlag, IPersonopplysning, ITjeneste } from '~/types/Consent';

export const meta = () => {
    return [{ title: 'Samtykke' }, { name: 'description', content: 'Liste over Samtykke' }];
};

export const loader = async ({ request }: { request: Request }) => {
    const orgName = await getSelectedOrganization(request);

    try {
        const behandlings = await ConsentApi.getBehandlings(orgName);
        const tjenster = await ConsentApi.getTjenste(orgName);
        const personopplysning = await ConsentApi.getPersonopplysning();
        const grunnlag = await ConsentApi.getBehandlingsgrunnlag();
        return json({
            behandling: behandlings,
            tjenster: tjenster,
            personopplysning: personopplysning,
            grunnlag: grunnlag,
        });
    } catch (error) {
        console.error('Error fetching data HELLO:', error);
        return json({ error: 'An error occurred while fetching data.' }, { status: 200 });
    }
};

export default function Index() {
    const [showAddServiceForm, setShowAddServiceForm] = useState(false);
    const [showAddTjenesteForm, setShowAddTjenesteForm] = useState(false);

    const breadcrumbs = [{ name: 'Samtykke', link: '/samtykke' }];
    const { behandling, tjenster, personopplysning, grunnlag, error } = useLoaderData<{
        behandling: IBehandling[];
        tjenster: ITjeneste[];
        personopplysning: IPersonopplysning[];
        grunnlag: IBehandlingsgrunnlag[];
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
        selectedPersonopplysning: string;
        selectedGrunnlag: string;
        selectedTjeneste: string;
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
                                Ny Samtykke
                            </Button>
                            <Button
                                size="small"
                                icon={<PlusIcon aria-hidden />}
                                onClick={handleAddTjenesteClick}>
                                Ny Tjeneste
                            </Button>
                        </>
                    )}
                </VStack>
            </HStack>

            <VStack gap={'6'}>
                <Box className="w-full" padding="6">
                    {error && (
                        <Alert variant="error">
                            Error - Brukes til å informere brukeren om at noe kritisk har skjedd.
                        </Alert>
                    )}
                    {showAddServiceForm && (
                        <AddServiceForm
                            personopplysninger={personopplysning}
                            grunnlager={grunnlag}
                            tjenester={tjenster}
                            onCancel={handleCancelClick}
                            onSave={handleSaveService}
                        />
                    )}
                    {showAddTjenesteForm && (
                        <AddTjenesteForm onCancel={handleCancelClick} onSave={handleSaveTjeneste} />
                    )}
                    {!showAddServiceForm && !showAddTjenesteForm && !error && (
                        <ServiceTable
                            behandlings={behandling}
                            tjenester={tjenster}
                            personopplysninger={personopplysning}
                            grunnlager={grunnlag}
                        />
                    )}
                </Box>
            </VStack>
        </>
    );
}
