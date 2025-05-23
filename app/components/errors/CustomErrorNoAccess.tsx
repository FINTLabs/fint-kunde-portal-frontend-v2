import React from 'react';
import { Box, Button, Heading, HGrid, Link, VStack } from '@navikt/ds-react';

const CustomErrorNoOrg = () => {
    return (
        <Box paddingBlock="20 8">
            <HGrid columns="minmax(auto,600px)">
                <VStack gap="16">
                    <Heading level="1" size="large" spacing>
                        Du har ikke tilgang til dette området. For å få tilgang til dette området,
                        kontakt fint-administratoren din.
                    </Heading>

                    <Link href="/" className="navds-link">
                        <Button>Gå til Kundeportalen Dashboard</Button>
                    </Link>
                </VStack>
            </HGrid>
        </Box>
    );
};

export default CustomErrorNoOrg;
