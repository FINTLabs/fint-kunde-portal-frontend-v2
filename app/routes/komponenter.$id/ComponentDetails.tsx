import React from 'react';
import { BodyShort, Checkbox, CheckboxGroup, HStack, Label, Tag, VStack } from '@navikt/ds-react';
import { IComponent } from '~/types/Component';

interface ClientComponentProps {
    component: IComponent;
}

const ClientDetails: React.FC<ClientComponentProps> = ({ component }) => {
    const selectedValuesEnv = [];
    if (component.inProduction) selectedValuesEnv.push('api');
    if (component.inPlayWithFint) selectedValuesEnv.push('pwf');
    if (component.inBeta) selectedValuesEnv.push('beta');

    const selectedValues = [];
    if (component.openData) selectedValues.push('openData');
    if (component.common) selectedValues.push('common');

    return (
        <HStack className="!flex !justify-between !items-center">
            <VStack gap={'2'}>
                <HStack gap={'2'}>
                    <Label>Navn</Label>
                    <BodyShort>{component.name}</BodyShort>
                </HStack>
                <HStack gap={'2'}>
                    <Label>Beskrivelse</Label>
                    <BodyShort>{component.description}</BodyShort>
                </HStack>
                <HStack gap={'2'}>
                    <Label>Sti</Label>
                    <BodyShort>{component.basePath}</BodyShort>
                </HStack>
                <HStack gap={'2'}>
                    <Label>Adapters</Label>
                    <BodyShort>{component.adapters.length}</BodyShort>
                </HStack>
                <HStack gap={'2'}>
                    <Label>Clients</Label>
                    <BodyShort>{component.clients.length}</BodyShort>
                </HStack>
            </VStack>
            <VStack>
                <HStack>
                    {component.openData && (
                        <Tag variant="neutral" size={'xsmall'}>
                            Åpne Data
                        </Tag>
                    )}
                </HStack>
                <HStack>
                    <CheckboxGroup
                        legend="Title"
                        // onChange={handleChange}
                        value={selectedValuesEnv}
                        size="small"
                        readOnly>
                        <Checkbox value="openData">Open Data</Checkbox>
                        <Checkbox value="common">Felles</Checkbox>
                    </CheckboxGroup>
                </HStack>
                <HStack>
                    <CheckboxGroup
                        legend="Miljø"
                        // onChange={handleChange}
                        value={selectedValuesEnv}
                        size="small"
                        readOnly>
                        <Checkbox value="pwf">Play with FINT</Checkbox>
                        <Checkbox value="beta">Beta</Checkbox>
                        <Checkbox value="api">API</Checkbox>
                    </CheckboxGroup>
                </HStack>
            </VStack>
        </HStack>
    );
};

export default ClientDetails;
