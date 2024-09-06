import React, { useState } from 'react';
import { Checkbox, Table } from '@navikt/ds-react';
import { IComponentConfig } from '~/types/ComponentConfig';

interface ConfigClassTableProps {
    matchedConfig: IComponentConfig;
}

const ConfigClassTable: React.FC<ConfigClassTableProps> = ({ matchedConfig }) => {
    const [accessRights, setAccessRights] = useState<
        Record<string, { all: boolean; read: boolean; write: boolean }>
    >({});

    const data = matchedConfig.classes;

    const handleCheckboxChange = (path: string, type: 'all' | 'read' | 'write') => {
        setAccessRights((prev) => {
            const current = prev[path] || { all: false, read: false, write: false };
            const updated = { ...current };

            if (type === 'all') {
                updated.all = !current.all;
                if (updated.all) {
                    updated.read = false;
                    updated.write = false;
                }
            } else {
                updated[type] = !current[type];
                if (updated.read || updated.write) {
                    updated.all = false;
                }
            }

            return { ...prev, [path]: updated };
        });
    };

    const handleSetAllRights = (setAll: boolean) => {
        setAccessRights((prev) => {
            const updated = { ...prev };
            data.forEach((x) => {
                updated[x.path] = { all: setAll, read: false, write: false };
            });
            return updated;
        });
    };

    return (
        <Table size="small">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
                    <Table.HeaderCell scope="col">
                        <Checkbox
                            checked={Object.values(accessRights).every((rights) => rights.all)}
                            indeterminate={
                                Object.values(accessRights).some((rights) => rights.all) &&
                                !Object.values(accessRights).every((rights) => rights.all)
                            }
                            onChange={(e) => handleSetAllRights(e.target.checked)}
                            aria-label="Set all to All Rights">
                            All Rights (Admin)
                        </Checkbox>
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col">Read</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Write</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map((x, i) => {
                    const rights = accessRights[x.path] || {
                        all: false,
                        read: false,
                        write: false,
                    };

                    return (
                        <Table.Row key={i + x.name}>
                            <Table.HeaderCell scope="row">
                                <span id={`id-${x.path}`}>{x.name}</span>
                            </Table.HeaderCell>
                            <Table.DataCell>
                                <Checkbox
                                    checked={rights.all}
                                    onChange={() => handleCheckboxChange(x.path, 'all')}
                                    aria-labelledby={`id-${x.path}-all`}>
                                    All Rights
                                </Checkbox>
                            </Table.DataCell>
                            <Table.DataCell>
                                <Checkbox
                                    checked={rights.read}
                                    disabled={rights.all}
                                    onChange={() => handleCheckboxChange(x.path, 'read')}
                                    aria-labelledby={`id-${x.path}-read`}>
                                    Read
                                </Checkbox>
                            </Table.DataCell>
                            <Table.DataCell>
                                <Checkbox
                                    checked={rights.write}
                                    disabled={rights.all}
                                    onChange={() => handleCheckboxChange(x.path, 'write')}
                                    aria-labelledby={`id-${x.path}-write`}>
                                    Write
                                </Checkbox>
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};

export default ConfigClassTable;
