import { Link } from '@remix-run/react';
import { Heading, BodyLong, Box } from '@navikt/ds-react';

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
                Novari (logo here)
            </Heading>
            <div style={{ marginBottom: '1rem' }}>
                <BodyLong>
                    <Link to="/support" style={{ marginRight: '1rem' }}>
                        Opprett support sak
                    </Link>
                    <Link to="/help" style={{ marginRight: '1rem' }}>
                        Brukerhjelp
                    </Link>
                </BodyLong>
            </div>
        </Box>
    );
}
