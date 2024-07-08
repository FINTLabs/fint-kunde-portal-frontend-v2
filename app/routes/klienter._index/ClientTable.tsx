import React from 'react';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, Table, VStack } from '@navikt/ds-react';
import { IClient } from '~/types/Clients';
import { useNavigate } from '@remix-run/react';

interface ClientTableProps {
    clients: IClient[];
}

const ClientTable: React.FC<ClientTableProps> = ({ clients }) => {
    const navigate = useNavigate();

    const handleRowClick = (client: IClient) => {
        navigate(`/klienter/${client.name}`);
    };

    return (
        <VStack>
            <Table>
                <Table.Body>
                    {clients?.map((client, i) => (
                        <Table.Row key={i + client.name} onClick={() => handleRowClick(client)}>
                            <Table.DataCell>
                                <Heading size="small">{client.shortDescription}</Heading>
                                <BodyShort textColor="subtle">{client.name}</BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>
                                <ChevronRightIcon title="a11y-title" fontSize="1.5rem" />
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </VStack>
    );
};

export default ClientTable;
