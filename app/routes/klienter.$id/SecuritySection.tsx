import React from 'react';
import { Box, Button, CopyButton, Table } from '@navikt/ds-react';
import { ArrowCirclepathIcon, BagdeIcon, DownloadIcon, ThumbUpIcon } from '@navikt/aksel-icons';
import { IClient } from '~/types/Clients';
import { log } from '~/utils/logger';

interface SecuritySectionProps {
    client: IClient;
}

function handleFetchSecret(downloadSecretButtonClicked: string) {
    log('Download Secret button clicked');
}

function handleUpdatePW(downloadSecretButtonClicked: string) {
    log('Update password clicked');
}

function handleCopyPassword() {
    return 'get password from somewhere';
}

function handleCopySecret() {
    return 'need to get secret from somewhere';
}

const SecuritySection: React.FC<SecuritySectionProps> = ({ client }) => (
    <>
        <Box
            // background="surface-subtle"
            // borderColor="border-alt-3"
            padding="4"
            // borderWidth="2"
            // borderRadius="xlarge"
        >
            <Table>
                <Table.Body>
                    <Table.Row>
                        <Table.DataCell>Brukernavn</Table.DataCell>
                        <Table.DataCell>{client.name}</Table.DataCell>
                        <Table.DataCell>
                            <CopyButton copyText={client.name} />
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell>Password</Table.DataCell>
                        <Table.DataCell>
                            ****{' '}
                            <Button
                                variant={'tertiary'}
                                onClick={() => handleUpdatePW('Download Secret button clicked')}
                                icon={
                                    <ArrowCirclepathIcon title="a11y-title" fontSize="1.5rem" />
                                }></Button>
                        </Table.DataCell>
                        <Table.DataCell>
                            <CopyButton copyText={handleCopyPassword()} />
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell>Klient ID</Table.DataCell>
                        <Table.DataCell>{client.clientId}</Table.DataCell>
                        <Table.DataCell>
                            <CopyButton copyText={client.clientId} />
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell>Klient Hemmelighet</Table.DataCell>
                        <Table.DataCell>
                            <Button
                                variant={'tertiary'}
                                onClick={() => handleFetchSecret('Download Secret button clicked')}
                                icon={
                                    <DownloadIcon title="a11y-title" fontSize="1.5rem" />
                                }></Button>
                        </Table.DataCell>
                        <Table.DataCell>
                            <CopyButton copyText={handleCopySecret()} />
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell>Resurs Id</Table.DataCell>
                        <Table.DataCell>{client.name}</Table.DataCell>
                        <Table.DataCell>
                            <CopyButton copyText={client.name} />
                        </Table.DataCell>
                    </Table.Row>
                </Table.Body>
            </Table>
            <CopyButton
                copyText="NEED TO UPDATE THIS TEXT"
                text="Kopier autentiseringsinformasjon"
                activeText="Autentiseringsinformasjon er kopiert"
                icon={<BagdeIcon aria-hidden />}
                activeIcon={<ThumbUpIcon aria-hidden />}
            />
        </Box>
    </>
);

export default SecuritySection;
