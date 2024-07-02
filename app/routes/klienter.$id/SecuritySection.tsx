import React from 'react';
import { Box, Button, CopyButton, Heading, Table } from '@navikt/ds-react';
import { ArrowCirclepathIcon, BagdeIcon, DownloadIcon, ThumbUpIcon } from '@navikt/aksel-icons';
import { IClient } from '~/types/Clients';

interface SecuritySectionProps {
    client: IClient;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({ client }) => (
    <>
        <Heading size={'medium'}>Security</Heading>
        <Box
            background="surface-subtle"
            borderColor="border-alt-3"
            padding="4"
            borderWidth="2"
            borderRadius="xlarge">
            <Table>
                <Table.Body>
                    <Table.Row>
                        <Table.DataCell>Brukernavn</Table.DataCell>
                        <Table.DataCell>{client.name}</Table.DataCell>
                        <Table.DataCell>
                            <CopyButton copyText="3.14" />
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell>Password</Table.DataCell>
                        <Table.DataCell>
                            ****{' '}
                            <Button
                                variant={'tertiary'}
                                icon={
                                    <ArrowCirclepathIcon title="a11y-title" fontSize="1.5rem" />
                                }></Button>
                        </Table.DataCell>
                        <Table.DataCell>
                            <CopyButton copyText="3.14" />
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell>Klient ID</Table.DataCell>
                        <Table.DataCell>{client.clientId}</Table.DataCell>
                        <Table.DataCell>
                            <CopyButton copyText="3.14" />
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell>Klient Hemmelighet</Table.DataCell>
                        <Table.DataCell>
                            <Button
                                variant={'tertiary'}
                                icon={
                                    <DownloadIcon title="a11y-title" fontSize="1.5rem" />
                                }></Button>
                        </Table.DataCell>
                        <Table.DataCell>
                            <CopyButton copyText="3.14" />
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell>Resurs Id</Table.DataCell>
                        <Table.DataCell>{client.name}</Table.DataCell>
                        <Table.DataCell>
                            <CopyButton copyText="3.14" />
                        </Table.DataCell>
                    </Table.Row>
                </Table.Body>
            </Table>
            <CopyButton
                copyText="https://aksel.nav.no/"
                text="Kopier autentiseringsinformasjon"
                activeText="Autentiseringsinformasjon er kopiert"
                icon={<BagdeIcon aria-hidden />}
                activeIcon={<ThumbUpIcon aria-hidden />}
            />
        </Box>
    </>
);

export default SecuritySection;
