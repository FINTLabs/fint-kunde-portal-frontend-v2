import type { LoaderFunctionArgs } from '@remix-run/node';
import React from 'react';
import { json, useLoaderData } from '@remix-run/react';
import ClientApi from '~/api/ClientApi';
import { BodyShort, Box, Button, CopyButton, Heading, Table } from '@navikt/ds-react';
import { ArrowCirclepathIcon, BagdeIcon, DownloadIcon, ThumbUpIcon } from '@navikt/aksel-icons';
import { IClient } from '~/types/Clients';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const organisation = 'fintlabs_no'; // todo: Replace with actual organisation identifier

    try {
        const client = await ClientApi.getClientById(organisation, params.id);
        return json(client);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};
export default function Index() {
    const client = useLoaderData<IClient>();

    return (
        <Box padding={'10'}>
            <Box padding="4">
                <Heading size="medium">{client.shortDescription}</Heading>
                <BodyShort>{client.name}</BodyShort>
                <BodyShort>{client.note}</BodyShort>
            </Box>
            {/*<HStack><Heading size="small">Components</Heading><Button variant={"tertiary"} icon={<PencilIcon title="Rediger" />} /></HStack>*/}

            <Heading size={'medium'}>Components</Heading>
            <Box
                background="surface-subtle"
                borderColor="border-alt-3"
                padding="4"
                borderWidth="2"
                borderRadius="xlarge">
                <ul>
                    {client.components.map((component, index) => (
                        <li key={index}>
                            <BodyShort>{component}</BodyShort>
                        </li>
                    ))}
                </ul>
            </Box>

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
        </Box>
    );
}
