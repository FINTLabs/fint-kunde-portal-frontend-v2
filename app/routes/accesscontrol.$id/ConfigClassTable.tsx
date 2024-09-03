import React, { useState } from 'react';
import { Checkbox, Table } from '@navikt/ds-react';
import { IComponentConfig } from '~/types/ComponentConfig';

interface ConfigClassTableProps {
    matchedConfig: IComponentConfig;
}

const ConfigClassTable: React.FC<ConfigClassTableProps> = ({ matchedConfig }) => {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const data = matchedConfig.classes;
    const toggleSelectedRow = (value: string) =>
        setSelectedRows((list) =>
            list.includes(value) ? list.filter((id) => id !== value) : [...list, value]
        );

    return (
        <Table size="small">
            <Table.Header>
                <Table.Row>
                    <Table.DataCell>
                        <Checkbox
                            checked={selectedRows.length === data.length}
                            indeterminate={
                                selectedRows.length > 0 && selectedRows.length !== data.length
                            }
                            onChange={() => {
                                selectedRows.length
                                    ? setSelectedRows([])
                                    : setSelectedRows(data.map((x) => x.path));
                            }}
                            hideLabel>
                            Velg alle rader
                        </Checkbox>
                    </Table.DataCell>

                    <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map((x, i) => {
                    return (
                        <Table.Row key={i + x.name} selected={selectedRows.includes(x.path)}>
                            <Table.DataCell>
                                <Checkbox
                                    hideLabel
                                    checked={selectedRows.includes(x.path)}
                                    onChange={() => toggleSelectedRow(x.path)}
                                    aria-labelledby={`id-${x.path}`}>
                                    {' '}
                                </Checkbox>
                            </Table.DataCell>
                            <Table.HeaderCell scope="row">
                                <span id={`id-${x.path}`}>{x.name}</span>
                            </Table.HeaderCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};

export default ConfigClassTable;
