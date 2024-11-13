import React from 'react';
import { BodyShort, Box, Button, Heading, HGrid, Link, List, VStack } from '@navikt/ds-react';

interface CustomErrorPageProps {
    statusCode?: number;
    statusTitle?: string;
    errorData?: string;
}

const CustomErrorPage: React.FC<CustomErrorPageProps> = ({
    statusCode = 500,
    statusTitle = 'Beklager, noe gikk galt.',
    errorData = 'unknown',
}) => {
    return (
        <Box paddingBlock="20 8">
            <HGrid columns="minmax(auto,600px)" data-aksel-template={`${statusCode}-v2`}>
                <VStack gap="16">
                    <VStack gap="12" align="start">
                        <div>
                            <BodyShort textColor="subtle" size="small">
                                Statuskode {statusCode}
                            </BodyShort>
                            <Heading level="1" size="large" spacing>
                                {statusTitle}
                            </Heading>
                            {statusCode === 403 ? (
                                <>
                                    <Link
                                        href="https://registrering.felleskomponent.no"
                                        className="navds-link">
                                        <Button>Trykk her for å opprette konto</Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <BodyShort spacing>
                                        En teknisk feil på våre servere gjør at siden er
                                        utilgjengelig.
                                    </BodyShort>
                                    <BodyShort>Du kan prøve å</BodyShort>
                                    <List>
                                        <List.Item>
                                            vente noen minutter og{' '}
                                            <Link href="#" onClick={() => location.reload()}>
                                                laste siden på nytt
                                            </Link>
                                        </List.Item>
                                        <List.Item>
                                            <Link href="#" onClick={() => history.back()}>
                                                gå tilbake til forrige side
                                            </Link>
                                        </List.Item>
                                    </List>
                                    <BodyShort>
                                        Hvis problemet vedvarer, kan du{' '}
                                        <Link href="https://support.novari.no/" target="_blank">
                                            kontakte oss (åpnes i ny fane)
                                        </Link>
                                        .
                                    </BodyShort>
                                    <Link href="/" className="navds-link">
                                        <Button>Gå til Kundeportalen Dashboard</Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        <BodyShort size="small" textColor="subtle">
                            Feil-data: {statusCode} - {errorData}
                        </BodyShort>
                    </VStack>

                    {/* DO WE WANT ENGLISH?? */}
                    {/*<div>*/}
                    {/*    <Heading level="1" size="large" spacing>*/}
                    {/*        Something went wrong*/}
                    {/*    </Heading>*/}
                    {/*    <BodyShort spacing>*/}
                    {/*        This was caused by a technical fault on our servers. Please refresh this*/}
                    {/*        page or try again in a few minutes.*/}
                    {/*    </BodyShort>*/}
                    {/*    <BodyShort>*/}
                    {/*        <Link target="_blank" href="https://support.novari.no/">*/}
                    {/*            Contact us (opens in new tab)*/}
                    {/*        </Link>{' '}*/}
                    {/*        if the problem persists.*/}
                    {/*    </BodyShort>*/}
                    {/*</div>*/}
                </VStack>
            </HGrid>
        </Box>
    );
};

export default CustomErrorPage;
