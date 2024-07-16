import { Box, Heading, Table, CopyButton } from '@navikt/ds-react';
import {
    FETCHER_PASSORD_KEY,
    FETCHER_CLIENT_SECRET_KEY,
} from '../../routes/adapter.$name/constants';
import { TableCellValue } from '../../routes/adapter.$name/TableCellValue';
import { ThumbUpIcon, BagdeIcon } from '@navikt/aksel-icons';

type AutentiseringProps = {
    name: string;
    passord: string;
    ressourceIds: string;
    clientId: string;
    clientSecret: string;
    allDetails: any;
};

function Autentisering({
    name,
    passord,
    clientId,
    ressourceIds,
    clientSecret,
    allDetails,
}: AutentiseringProps) {
    return (
        <Box>
            <Heading size="medium" spacing>
                Autentisering
            </Heading>

            <Box padding={'4'}>
                <Table>
                    <Table.Body>
                        <Table.Row>
                            <TableCellValue label={'Brukernavn'} value={name} />
                        </Table.Row>
                        <Table.Row>
                            <TableCellValue
                                label={'Passord'}
                                value={passord}
                                fetcherKey={FETCHER_PASSORD_KEY}
                            />
                        </Table.Row>
                        <Table.Row>
                            <TableCellValue label={'Klient ID'} value={clientId} />
                        </Table.Row>

                        <Table.Row>
                            <TableCellValue
                                label={'Klient Hemmelighet'}
                                value={clientSecret}
                                fetcherKey={FETCHER_CLIENT_SECRET_KEY}
                            />
                        </Table.Row>
                        <Table.Row>
                            <TableCellValue label={'RessursId-er'} value={ressourceIds} />
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Box>
            <CopyButton
                className="!mx-auto"
                copyText={JSON.stringify(allDetails)}
                text="Kopier autentiseringsinformasjon"
                activeText="Autentiseringsinformasjon er kopiert"
                icon={<BagdeIcon aria-hidden />}
                activeIcon={<ThumbUpIcon aria-hidden />}
            />
        </Box>
    );
}

export default Autentisering;
