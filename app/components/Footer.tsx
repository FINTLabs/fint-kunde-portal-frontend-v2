import { Link } from '@remix-run/react';
import { Heading, BodyLong, Box } from '@navikt/ds-react';
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
                <BodyLong>
                    <Link to="http://support.novari.no" style={{ marginRight: '1rem' }}>
                        Opprett supportsak
                    </Link>
                    <Link to="/help" style={{ marginRight: '1rem' }}>
                        Brukerhjelp
                    </Link>
                    <Link to="http://fintlabs.no" style={{ marginRight: '1rem' }}>
                        FINT Labs
                    </Link>
                </BodyLong>
            </div>
        </Box>
    );
}
