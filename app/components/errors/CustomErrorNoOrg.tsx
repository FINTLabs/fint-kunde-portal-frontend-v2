import { Box, Heading, HGrid, VStack } from '@navikt/ds-react';
import React from 'react';

const CustomErrorNoOrg = () => {
    return (
        <Box paddingBlock="space-24">
            <HGrid columns="minmax(auto,600px)">
                <VStack gap="space-16">
                    <Heading level="1" size="large" spacing>
                        Du er ikke tilknyttet en organisasjon. Gå til FINT administratoren i
                        organisasjonen din for å få tilgang.
                    </Heading>

                    {/*<Link href="/" className="navds-link">*/}
                    {/*    <Button>Gå til Kundeportalen Dashboard</Button>*/}
                    {/*</Link>*/}
                </VStack>
            </HGrid>
        </Box>
    );
};

export default CustomErrorNoOrg;
