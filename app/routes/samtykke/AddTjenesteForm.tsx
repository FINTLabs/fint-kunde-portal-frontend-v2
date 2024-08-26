import React, { useState } from 'react';
import { Box, Button, HStack, VStack, TextField } from '@navikt/ds-react';

interface AddTjenesteFormProps {
    onCancel: () => void;
    onSave: (formData: { tjenesteNavn: string; tjenesteKode: string }) => void;
}

const AddTjenesteForm: React.FC<AddTjenesteFormProps> = ({ onCancel, onSave }) => {
    const [tjenesteNavn, setTjenesteNavn] = useState('');
    const [tjenesteKode, setTjenesteKode] = useState('');

    const handleSave = () => {
        const formData = {
            tjenesteNavn,
            tjenesteKode,
        };
        onSave(formData);
    };

    return (
        <Box padding="6" borderRadius="large" shadow="small">
            <VStack gap="4">
                <TextField
                    label="Tjeneste Navn"
                    size="small"
                    value={tjenesteNavn}
                    onChange={(e) => setTjenesteNavn(e.target.value)}
                />
                <TextField
                    label="Tjeneste Kode"
                    size="small"
                    value={tjenesteKode}
                    onChange={(e) => setTjenesteKode(e.target.value)}
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

export default AddTjenesteForm;
