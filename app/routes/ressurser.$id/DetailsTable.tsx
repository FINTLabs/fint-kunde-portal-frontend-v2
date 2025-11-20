import { BodyShort, Heading, Switch, Table } from '@navikt/ds-react';
import React from 'react';

import { IAdapter } from '~/types/Adapter';
import { IAsset } from '~/types/Asset';
import { IClient } from '~/types/Clients';

interface ResourceTableProps {
    data: IAdapter[] | IClient[];
    assetData: IAsset;
    onSwitchChange: (adapterName: string, isChecked: boolean) => void;
    isClient: boolean;
}

const DetailsTable = ({ data, assetData, onSwitchChange, isClient }: ResourceTableProps) => {
    const isConnected = (item: IAdapter | IClient) => {
        if (isClient) {
            return assetData.clients.includes(item.dn);
        } else {
            return assetData.adapters.includes(item.dn);
        }
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
                {data.map((element) => (
                    <Table.Row key={element.dn}>
                        <Table.DataCell>
                            <Switch
                                data-cy={`component-toggle-${element.name}`}
                                size="small"
                                hideLabel
                                checked={isConnected(element)}
                                onChange={(e) => handleSwitchChange(element.name, e.target.checked)}
                                disabled={
                                    isClient && assetData.primaryAsset && isConnected(element)
                                }>
                                {element.name}
                            </Switch>
                        </Table.DataCell>
                        {/*<Table.DataCell>{adapter.name}</Table.DataCell>*/}
                        <Table.DataCell>
                            <Heading size="small">{element.shortDescription}</Heading>
                            <BodyShort textColor="subtle">{element.name}</BodyShort>
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default DetailsTable;
