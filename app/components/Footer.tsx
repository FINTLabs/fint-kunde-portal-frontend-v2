import { Link } from '@remix-run/react';
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
                <Link to="http://novari.no" style={{ color: '#FFFFFF' }}>
                    <Logo width={100} />{' '}
                </Link>
            </Heading>
            <div style={{ marginBottom: '1rem' }}>
                <HStack gap="4">
                    <Link to="https://novari.no/driftsmeldinger/" style={{ color: '#FFFFFF' }}>
                        Driftsmeldinger
                    </Link>
                    <p style={{ color: '#FFFFFF' }}>|</p>
                    <Link to="http://support.novari.no" style={{ color: '#FFFFFF' }}>
                        Opprett supportsak
                    </Link>
                    <p style={{ color: '#FFFFFF' }}>|</p>
                    <Link to="http://fintlabs.no" style={{ color: '#FFFFFF' }}>
                        Brukerhjelp
                    </Link>
                    <p style={{ color: '#FFFFFF' }}>|</p>
                    <Link to="/help" style={{ color: '#FFFFFF' }}>
                        Ordliste
                    </Link>
                </HStack>
            </div>
        </Box>
    );
}
