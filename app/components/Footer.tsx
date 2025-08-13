import { Link } from 'react-router';
import { Box, Heading, HStack } from '@navikt/ds-react';
import { Logo } from '~/components/Menu/Logo';

export default function Footer() {
    return (
        <Box
            style={{
                padding: '2rem',
                marginTop: '2rem',
                // backgroundColor: "#f1f1f1",
                // textAlign: "center",
            }}>
            <Heading level="2" size="medium" spacing>
                <Logo />
            </Heading>
            <div style={{ marginBottom: '1rem' }}>
                <HStack gap="4">
                    <Link to="https://novari.no/driftsmeldinger/" style={{ color: '#FCF5ED' }}>
                        Driftsmeldinger
                    </Link>
                    <p style={{ color: '#FCF5ED' }}>|</p>
                    <Link to="http://support.novari.no" style={{ color: '#FCF5ED' }}>
                        Opprett supportsak
                    </Link>
                    <p style={{ color: '#FCF5ED' }}>|</p>
                    <Link to="http://fintlabs.no" style={{ color: '#FCF5ED' }}>
                        Brukerhjelp
                    </Link>
                    <p style={{ color: '#FCF5ED' }}>|</p>
                    <Link to="/help/" style={{ color: '#FCF5ED' }}>
                        Ordliste
                    </Link>
                    <p style={{ color: '#FCF5ED' }}>|</p>
                    <Link to="https://api.felleskomponent.no/" style={{ color: '#FCF5ED' }}>
                        FINT Test Client
                    </Link>
                </HStack>
            </div>
        </Box>
    );
}
