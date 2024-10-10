import { Link } from '@remix-run/react';
import { Box, Heading, HStack } from '@navikt/ds-react';

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
                <img src="/images/logo_new.png" width={100} height={50} alt="Novari Logo" />
            </Heading>
            <div style={{ marginBottom: '1rem' }}>
                <HStack gap="4">
                    <Link to="http://support.novari.no">Opprett supportsak</Link>
                    <p
                        style={{
                            color: 'var(--a-text-on-neutral)',
                        }}>
                        |
                    </p>
                    <Link to="http://novari.no">Novari.no</Link>
                    <p
                        style={{
                            color: 'var(--a-text-on-neutral)',
                        }}>
                        |
                    </p>
                    <Link to="http://fintlabs.no">Brukerhjelp</Link>
                </HStack>
            </div>
        </Box>
    );
}
