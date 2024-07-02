import React from 'react';
import { Box, Heading, BodyShort } from '@navikt/ds-react';
import { IClient } from '~/types/Clients';

interface ComponentsSectionProps {
    components: IClient['components'];
}

const ComponentsSection: React.FC<ComponentsSectionProps> = ({ components }) => (
    <>
        <Heading size={'medium'}>Components</Heading>
        <Box
            background="surface-subtle"
            borderColor="border-alt-3"
            padding="4"
            borderWidth="2"
            borderRadius="xlarge">
            <ul>
                {components.map((component, index) => (
                    <li key={index}>
                        <BodyShort>{component}</BodyShort>
                    </li>
                ))}
            </ul>
        </Box>
    </>
);

export default ComponentsSection;
