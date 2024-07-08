import React, { useState } from 'react';
import { Box, Label, HStack, BodyLong, Button, TextField, Switch } from '@navikt/ds-react';
import { PencilIcon } from '@navikt/aksel-icons';
import { IComponent } from '~/types/Component';

interface ClientComponentProps {
    component: IComponent;
}

const ClientDetails: React.FC<ClientComponentProps> = ({ component }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        basePath: component.basePath,
        openData: component.openData,
        common: component.common,
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSaveClick = () => {
        // Handle the save action (e.g., API call)
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        // Reset the form data to the initial state
        setFormData({
            basePath: component.basePath,
            openData: component.openData,
            common: component.common,
        });
        setIsEditing(false);
    };

    return (
        <Box padding="4">
            {!isEditing ? (
                <Box>
                    <HStack className="!flex !justify-between !items-center">
                        <Label>Sti</Label>
                        <BodyLong>{component.basePath}</BodyLong>
                        <Button
                            icon={<PencilIcon title="Rediger" />}
                            variant="tertiary"
                            onClick={handleEditClick}
                        />
                    </HStack>
                    <HStack>
                        <Label>Åpne data</Label>
                        <BodyLong>{component.openData}</BodyLong>
                    </HStack>
                    <HStack>
                        <Label>Felles</Label>
                        <BodyLong>{component.common}</BodyLong>
                    </HStack>
                </Box>
            ) : (
                <Box>
                    <TextField label="Har du noen tilbakemeldinger?" />
                    <Switch>Varsle med SMS</Switch>
                    <Switch>Varsle med SMS</Switch>
                    <HStack>
                        <Button onClick={handleSaveClick}>Lagre</Button>
                        <Button variant="secondary" onClick={handleCancelClick}>
                            Avbryt
                        </Button>
                    </HStack>
                </Box>
            )}
        </Box>
    );
};

export default ClientDetails;
