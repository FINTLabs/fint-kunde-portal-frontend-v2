import React from "react";
import {ChevronRightIcon} from "@navikt/aksel-icons";
import {BodyShort, Heading, Table, VStack} from "@navikt/ds-react";
import {IClient} from "~/types/Clients";

interface ClientTableProps {
    clients: IClient[];
    onRowClick: (client: IClient) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({ clients, onRowClick }) => {

    return (
        <VStack>
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {clients?.map((client, i) => (
                    <Table.Row key={i + client.name} onClick={() => onRowClick(client)}>
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

        {/*<Pagination*/}
        {/*    page={page}*/}
        {/*    onPageChange={setPage}*/}
        {/*    count={Math.ceil(clients.length / rowsPerPage)}*/}
        {/*    size="small"*/}
        {/*/>*/}

        </VStack>
    );
};

export default ClientTable;
