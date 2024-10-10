import { BodyShort, Box, Button, Heading, HGrid, Link, List, VStack } from '@navikt/ds-react';

export default function CustomError() {
    return (
        <Box paddingBlock="20 8">
            <HGrid columns="minmax(auto,600px)" data-aksel-template="500-v2">
                <VStack gap="16">
                    <VStack gap="12" align="start">
                        <div>
                            {/* Tekster bør tilpasses den aktuelle 500-feilen. Teksten under er for en generisk 500-feil. */}
                            <BodyShort spacing>
                                En teknisk feil på våre servere gjør at siden er utilgjengelig.
                                Dette skyldes ikke noe du gjorde.
                            </BodyShort>
                            <BodyShort>Du kan prøve å</BodyShort>
                            <List>
                                <List.Item>
                                    vente noen minutter og{' '}
                                    {/* Husk at POST-data går tapt når man reloader med JS. For å unngå dette kan dere
                          fjerne lenken (men beholde teksten) slik at man må bruke nettleserens reload-knapp. */}
                                    <Link href="#" onClick={() => location.reload()}>
                                        laste siden på nytt
                                    </Link>
                                </List.Item>
                                <List.Item>
                                    {/* Vurder å sjekke at window.history.length > 1 før dere rendrer dette som en lenke */}
                                    <Link href="#" onClick={() => history.back()}>
                                        gå tilbake til forrige side
                                    </Link>
                                </List.Item>
                            </List>
                            <BodyShort>
                                Hvis problemet vedvarer, kan du{' '}
                                <Link href="https://support.jira.novari.no/" target="_blank">
                                    kontakte oss (åpnes i ny fane)
                                </Link>
                                .
                            </BodyShort>
                        </div>

                        {/*<BodyShort size="small" textColor="subtle">*/}
                        {/*    Feil-id: 12345678-9123-4567-8912-345678912345*/}
                        {/*</BodyShort>*/}

                        <Link href="/" className="navds-link">
                            <Button>Gå til Kundeportalen Dashboard</Button>
                        </Link>
                    </VStack>

                    <div>
                        <Heading level="1" size="large" spacing>
                            Something went wrong
                        </Heading>
                        <BodyShort spacing>
                            This was caused by a technical fault on our servers. Please refresh this
                            page or try again in a few minutes.{' '}
                        </BodyShort>
                        <BodyShort>
                            <Link target="_blank" href="https://support.jira.novari.no/">
                                Contact us (opens in new tab)
                            </Link>{' '}
                            if the problem persists.
                        </BodyShort>
                    </div>
                </VStack>
            </HGrid>
        </Box>
    );
}
