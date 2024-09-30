import { Link } from '@remix-run/react';
import { Heading, BodyLong, Box, HStack } from '@navikt/ds-react';
import logo from '/images/logo_new.png';

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
                <img src={logo} width={100} height={50} alt={'Novari Logo'} />
            </Heading>
            <div style={{ marginBottom: '1rem' }}>
                <HStack gap="4">
                    <Link to="http://support.novari.no">Opprett supportsak</Link>
                    <p>|</p>
                    <Link to="http://novari.no">Novari.no</Link>
                    <p>|</p>
                    <Link to="http://fintlabs.no">Brukerhjelp</Link>
                </HStack>
            </div>
        </Box>
    );
}
