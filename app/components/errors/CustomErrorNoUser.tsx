import React from 'react';
import { Box, Button, Heading, HGrid, Link, VStack } from '@navikt/ds-react';

const CustomErrorNoUser = () => {
    return (
        <Box paddingBlock="20 8">
            <HGrid columns="minmax(auto,600px)">
                <VStack gap="16">
                    <Heading level="1" size="large" spacing>
                        Du har ikke opprettet bruker.
                    </Heading>

                    <Link href="https://registrering.felleskomponent.no" className="navds-link">
                        <Button>Trykk her for å opprette konto</Button>
                    </Link>
                </VStack>
            </HGrid>
        </Box>
    );
};

export default CustomErrorNoUser;
