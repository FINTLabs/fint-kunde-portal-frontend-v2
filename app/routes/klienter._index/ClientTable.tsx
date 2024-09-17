import React from 'react';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, Label, Switch, Table, VStack } from '@navikt/ds-react';
import { IClient } from '~/types/Clients';
import { useNavigate } from '@remix-run/react';

interface ClientTableProps {
    clients: IClient[];
    selectable?: boolean;
    selectedItems?: string[];
    toggleSwitch?: (name: string, checked: boolean) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({
    clients,
    selectable,
    selectedItems,
    toggleSwitch,
}) => {
    const navigate = useNavigate();

    const handleRowClick = (client: IClient) => {
        navigate(`/klienter/${client.name}`);
    };

    return (
        <VStack>
            <Table size={'small'}>
                <Table.Body>
                    {clients?.map((item, i) => (
                        <Table.Row key={i + item.name}>
                            {selectable && (
                                <Table.DataCell scope="row">
                                    <Switch
                                        checked={
                                            selectedItems &&
                                            selectedItems.some((selected) => selected === item.name)
                                        }
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            toggleSwitch && toggleSwitch(item.name, isChecked);
                                        }}>
                                        <Label>{''}</Label>
                                    </Switch>
                                </Table.DataCell>
                            )}
                            <Table.DataCell onClick={() => handleRowClick(item)}>
                                <Heading size="small">{item.shortDescription}</Heading>
                                <BodyShort textColor="subtle">{item.name}</BodyShort>
                            </Table.DataCell>
                            <Table.DataCell onClick={() => handleRowClick(item)}>
                                <ChevronRightIcon title="Gå tilbake" fontSize="1.5rem" />
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </VStack>
    );
};

export default ClientTable;
