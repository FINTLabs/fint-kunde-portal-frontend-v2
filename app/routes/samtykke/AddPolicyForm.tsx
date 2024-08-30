import React, { useState } from 'react';
import { Box, Button, HStack, VStack, TextField, Select } from '@navikt/ds-react';
import { IPersonopplysning, IBehandlingsgrunnlag, ITjeneste } from '~/types/Consent';

interface AddConsentFormProps {
    personalData: IPersonopplysning[];
    foundation: IBehandlingsgrunnlag[];
    service: ITjeneste[];
    onCancel: () => void;
    onSave: (formData: {
        selectedPersonalData: string;
        selectedFoundation: string;
        selectedService: string;
        note: string;
    }) => void;
}

const AddPolicyForm: React.FC<AddConsentFormProps> = ({
    personalData,
    foundation,
    service,
    onCancel,
    onSave,
}) => {
    const [selectedPersonalData, setSelectedPersonalData] = useState('');
    const [selectedFoundation, setSelectedFoundation] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [note, setNote] = useState('');

    const [selectedPersonalDataError, setSelectedPersonalDataError] = useState<
        string | undefined
    >();
    const [selectedFoudnationError, setSelectedFoudnationError] = useState<string | undefined>();
    const [selectedServiceError, setSelectedServiceError] = useState<string | undefined>();

    const [noteError, setNoteError] = useState<string | undefined>();

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

        if (note && note?.length < 3) {
            setNoteError('Formal er påkrevd');
            isValid = false;
        }

        if (isValid) {
            const formData = {
                selectedPersonalData: selectedPersonalData,
                selectedFoundation: selectedFoundation,
                selectedService: selectedService,
                note: note,
            };
            onSave(formData);
        }
    };

    return (
        <Box padding="6" borderRadius="large" shadow="small">
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
                <TextField
                    label="Formål"
                    onChange={(e) => setNote(e.target.value)}
                    error={noteError}
                />
                <HStack justify="end" gap="4">
                    <Button variant="secondary" onClick={onCancel}>
                        Avbryt
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Lagre
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default AddPolicyForm;
