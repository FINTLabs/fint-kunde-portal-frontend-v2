import React from 'react';
import { BodyShort, Heading, Switch, Table } from '@navikt/ds-react';
import { IAsset } from '~/types/Asset';

interface ResourceTableProps {
    data: any[];
    assetData: IAsset;
    onSwitchChange: (adapterName: string, isChecked: boolean) => void;
    isClient: boolean;
}

const DetailsTable = ({ data, assetData, onSwitchChange, isClient }: ResourceTableProps) => {
    const isConnected = (adapterDN: any) => {
        // Check if asset matches directly
        if (adapterDN.asset) {
            return adapterDN.asset === assetData.dn;
        }

        // Check if id matches any of the assets
        if (adapterDN.assets) {
            return adapterDN.assets.some((asset: string) => asset === assetData.dn);
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
