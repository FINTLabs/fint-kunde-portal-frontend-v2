import React, { useState } from 'react';
import { Box, Button, HStack, VStack, TextField } from '@navikt/ds-react';

interface AddTjenesteFormProps {
    onCancel: () => void;
    onSave: (formData: { newServiceName: string }) => void;
}

const AddServiceForm: React.FC<AddTjenesteFormProps> = ({ onCancel, onSave }) => {
    const [newServiceName, setNewServiceName] = useState('');
    const [serviceNameError, setServiceNameError] = useState<string | undefined>();

    const handleSave = () => {
        let isValid = true;

        if (newServiceName.trim() === '') {
            setServiceNameError('Tjeneste Navn er påkrevd');
            isValid = false;
        } else {
            setServiceNameError(undefined);
        }

        console.log(isValid);
        if (isValid) {
            const formData = {
                newServiceName: newServiceName,
            };
            onSave(formData);
        }
    };

    return (
        <Box padding="6" borderRadius="large" shadow="small">
            <VStack gap="4">
                <TextField
                    label="Tjeneste Navn"
                    size="small"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    error={serviceNameError}
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

export default AddServiceForm;
