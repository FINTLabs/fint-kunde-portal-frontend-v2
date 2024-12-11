import React from 'react';
import { BodyShort, Heading, Switch, Table } from '@navikt/ds-react';

interface Adapter {
    dn: string;
    name: string;
    shortDescription: string;
}

interface AdapterTableProps {
    data: Adapter[];
    assetData: string[];
    onSwitchChange: (adapterName: string, isChecked: boolean) => void;
}

const DetailsTable = ({ data, assetData, onSwitchChange }: AdapterTableProps) => {
    const hasRole = (adapterDN: string) => {
        if (assetData) {
            return assetData.includes(String(adapterDN)) ?? false;
        }
        return false;
    };

    const handleSwitchChange = (adapterName: string, isChecked: boolean) => {
        onSwitchChange(adapterName, isChecked);
    };

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    {/*<Table.HeaderCell />*/}
                    <Table.HeaderCell>Legg til</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map((adapter) => (
                    <Table.Row key={adapter.dn}>
                        <Table.DataCell>
                            <Switch
                                size="small"
                                hideLabel
                                checked={hasRole(adapter.dn)}
                                onChange={(e) =>
                                    handleSwitchChange(adapter.name, e.target.checked)
                                }>
                                {adapter.name}
                                {/*{adapter.shortDescription}*/}
                            </Switch>
                        </Table.DataCell>
                        {/*<Table.DataCell>{adapter.name}</Table.DataCell>*/}
                        <Table.DataCell>
                            <Heading size="small">{adapter.name}</Heading>
                            <BodyShort textColor="subtle">{adapter.shortDescription}</BodyShort>
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default DetailsTable;
