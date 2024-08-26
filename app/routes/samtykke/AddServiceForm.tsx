import React, { useState } from 'react';
import { Box, Button, HStack, VStack, TextField, Select } from '@navikt/ds-react';
import { IPersonopplysning, IBehandlingsgrunnlag, ITjeneste } from '~/types/Consent';

interface AddServiceFormProps {
    personopplysninger: IPersonopplysning[];
    grunnlager: IBehandlingsgrunnlag[];
    tjenester: ITjeneste[];
    onCancel: () => void;
    onSave: (formData: {
        selectedPersonopplysning: string;
        selectedGrunnlag: string;
        selectedTjeneste: string;
    }) => void;
}

const AddServiceForm: React.FC<AddServiceFormProps> = ({
    personopplysninger,
    grunnlager,
    tjenester,
    onCancel,
    onSave,
}) => {
    const [selectedPersonopplysning, setSelectedPersonopplysning] = useState('');
    const [selectedGrunnlag, setSelectedGrunnlag] = useState('');
    const [selectedTjeneste, setSelectedTjeneste] = useState('');

    const handleSave = () => {
        const formData = {
            selectedPersonopplysning,
            selectedGrunnlag,
            selectedTjeneste,
        };
        onSave(formData);
    };

    return (
        <Box padding="6" borderRadius="large" shadow="small">
            <VStack gap="4">
                <Select
                    label="Personopplysning"
                    value={selectedPersonopplysning}
                    onChange={(e) => setSelectedPersonopplysning(e.target.value)}>
                    <option value="">Velg personopplysning</option>
                    {personopplysninger.map((person) => (
                        <option key={person.id} value={person.id}>
                            {person.navn}({person.kode} )
                        </option>
                    ))}
                </Select>
                <Select
                    label="Behandlingsgrunnlag"
                    value={selectedGrunnlag}
                    onChange={(e) => setSelectedGrunnlag(e.target.value)}>
                    <option value="">Velg behandlingsgrunnlag</option>
                    {grunnlager.map((grunn) => (
                        <option key={grunn.id} value={grunn.id}>
                            {grunn.navn}
                        </option>
                    ))}
                </Select>
                <Select
                    label="Tjeneste"
                    value={selectedTjeneste}
                    onChange={(e) => setSelectedTjeneste(e.target.value)}>
                    <option value="">Velg tjeneste</option>
                    {tjenester.map((tjeneste) => (
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
        </Box>
    );
};

export default AddServiceForm;
