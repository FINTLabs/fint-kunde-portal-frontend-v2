import { BodyShort, Checkbox, CheckboxGroup, HStack, Label, VStack } from '@navikt/ds-react';
import React from 'react';

import { IComponent } from '~/types/Component';

interface ComponentDetailProps {
    component: IComponent;
}

const ComponentDetails = ({ component }: ComponentDetailProps) => {
    const selectedValuesEnv = [];
    if (component.inProduction) selectedValuesEnv.push('api');
    if (component.inPlayWithFint) selectedValuesEnv.push('pwf');
    if (component.inBeta) selectedValuesEnv.push('beta');

    const selectedValues = [];
    if (component.openData) selectedValues.push('openData');
    if (component.common) selectedValues.push('common');

    return (
        <HStack gap={'space-2'} justify="space-between" padding={'space-24'}>
            <VStack gap={'space-8'} paddingBlock={'space-16'}>
                <div>
                    <Label>Navn: </Label>
                    <BodyShort>{component.name}</BodyShort>
                </div>
                <div>
                    <Label>Beskrivelse: </Label>
                    <BodyShort>{component.description}</BodyShort>
                </div>
                <div>
                    <Label>Sti: </Label>
                    <BodyShort>{component.basePath}</BodyShort>
                </div>
            </VStack>
            <VStack>
                <HStack gap={'space-2'} justify="space-between" padding={'space-8'}>
                    <CheckboxGroup
                        legend="Tilgjengelighet"
                        // onChange={handleChange}
                        value={selectedValuesEnv}
                        size="small"
                        readOnly>
                        <Checkbox value="openData">Åpne data</Checkbox>
                        <Checkbox value="common">Felles</Checkbox>
                    </CheckboxGroup>
                </HStack>
                <HStack gap={'space-2'} justify="space-between" padding={'space-8'}>
                    <CheckboxGroup
                        legend="Miljø"
                        //Open Data onChange={handleChange}
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

export default ComponentDetails;
