import { BodyShort, Heading, Switch, Table } from '@navikt/ds-react';
import React from 'react';

import { IAsset } from '~/types/Asset';

interface ResourceTableProps {
    data: IAsset[];
    assetData: IAsset;
    onSwitchChange: (adapterName: string, isChecked: boolean) => void;
    isClient: boolean;
}

const DetailsTable = ({ data, assetData, onSwitchChange, isClient }: ResourceTableProps) => {
    const isConnected = (adapterDN: IAsset) => {
        // Check if asset matches directly
        if (adapterDN.assetId) {
            return adapterDN.assetId === assetData.dn;
        }

        // Check if assetId is an array and matches any of the assets
        if (Array.isArray(adapterDN.assetId)) {
            return adapterDN.assetId.some((asset: string) => asset === assetData.dn);
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
                            <Heading size="small">{element.description}</Heading>
                            <BodyShort textColor="subtle">{element.name}</BodyShort>
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default DetailsTable;
