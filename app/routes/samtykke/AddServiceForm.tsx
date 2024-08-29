import React, { useState } from 'react';
import { Box, Button, HStack, VStack, TextField, Select } from '@navikt/ds-react';
import { IPersonopplysning, IBehandlingsgrunnlag, ITjeneste } from '~/types/Consent';

interface AddServiceFormProps {
    personalData: IPersonopplysning[];
    foundation: IBehandlingsgrunnlag[];
    service: ITjeneste[];
    onCancel: () => void;
    f: any;
}

const AddServiceForm: React.FC<AddServiceFormProps> = ({
    personalData,
    foundation,
    service,
    onCancel,
    f,
}) => {
    const [selectedPersonalData, setSelectedPersonalData] = useState('');
    const [selectedFoundation, setSelectedFoundation] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedPersonalDataError, setSelectedPersonalDataError] = useState<
        string | undefined
    >();
    const [selectedFoudnationError, setSelectedFoudnationError] = useState<string | undefined>();
    const [selectedServiceError, setSelectedServiceError] = useState<string | undefined>();

    const handleSave = () => {
        let isValid = true;

        if (selectedPersonalData === '') {
            setSelectedPersonalDataError('Personopplysning er påkrevd');
            isValid = false;
        } else {
            setSelectedPersonalDataError(undefined);
        }

        if (selectedFoundation === '') {
            setSelectedFoudnationError('Behandlingsgrunnlag er påkrevd');
            isValid = false;
        } else {
            setSelectedFoudnationError(undefined);
        }

        if (selectedService === '') {
            setSelectedServiceError('Tjeneste er påkrevd');
            isValid = false;
        } else {
            setSelectedServiceError(undefined);
        }

        if (isValid) {
            const formData = {
                selectedPersonalData: selectedPersonalData,
                selectedFoundation: selectedFoundation,
                selectedService: selectedService,
            };
            f.submit();
        }
    };

    return (
        <Box padding="6" borderRadius="large" shadow="small">
            <f.Form>
                <VStack gap="4">
                    <Select
                        label="Personopplysning"
                        value={selectedPersonalData}
                        onChange={(e) => setSelectedPersonalData(e.target.value)}
                        error={selectedPersonalDataError}>
                        <option value="">Velg personopplysning</option>
                        {personalData.map((person) => (
                            <option key={person.id} value={person.id}>
                                {person.navn}({person.kode})
                            </option>
                        ))}
                    </Select>
                    <Select
                        label="Behandlingsgrunnlag"
                        value={selectedFoundation}
                        onChange={(e) => setSelectedFoundation(e.target.value)}
                        error={selectedFoudnationError}>
                        <option value="">Velg behandlingsgrunnlag</option>
                        {foundation.map((grunn) => (
                            <option key={grunn.id} value={grunn.id}>
                                {grunn.navn}
                            </option>
                        ))}
                    </Select>
                    <Select
                        label="Tjeneste"
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        error={selectedServiceError}>
                        <option value="">Velg tjeneste</option>
                        {service.map((tjeneste) => (
                            <option key={tjeneste.id} value={tjeneste.id}>
                                {tjeneste.navn}
                            </option>
                        ))}
                    </Select>
                    <TextField label="Formål" />
                    <HStack justify="end" gap="4">
                        <Button variant="secondary" onClick={onCancel}>
                            Avbryt
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Lagre
                        </Button>
                    </HStack>
                </VStack>
            </f.Form>
        </Box>
    );
};

export default AddServiceForm;
