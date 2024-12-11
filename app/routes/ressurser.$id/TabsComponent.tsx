// ~/components/shared/TabsComponent.tsx

import { BriefcaseIcon, ComponentIcon } from '@navikt/aksel-icons';
import { Tabs } from '@navikt/ds-react';
import DetailsTable from '~/routes/ressurser.$id/DetailsTable';
import React from 'react';
import { IAsset } from '~/types/Asset';
import { IClient } from '~/types/Clients';
import { IAdapter } from '~/types/Adapter';

interface TabsComponentProps {
    asset: IAsset;
    unmanagedAdapters: IAdapter[];
    unmanagedClients: IClient[];
    onAdapterSwitchChange: (adapterName: string, isChecked: boolean) => void;
    onClientSwitchChange: (clientName: string, isChecked: boolean) => void;
}
const TabsComponent = ({
    asset,
    unmanagedAdapters,
    unmanagedClients,
    onAdapterSwitchChange,
    onClientSwitchChange,
}: TabsComponentProps) => {
    return (
        <Tabs defaultValue="unmanaged" fill>
            <Tabs.List>
                <Tabs.Tab value="unmanaged" label="Adaptere" icon={<BriefcaseIcon aria-hidden />} />
                <Tabs.Tab
                    value="unmanagedClients"
                    label="Klienter"
                    icon={<ComponentIcon aria-hidden />}
                />
            </Tabs.List>
            <Tabs.Panel value="unmanaged" className="w-full">
                <DetailsTable
                    data={unmanagedAdapters}
                    assetData={asset.adapters}
                    onSwitchChange={onAdapterSwitchChange}
                />
            </Tabs.Panel>
            <Tabs.Panel value="unmanagedClients" className="w-full">
                <DetailsTable
                    data={unmanagedClients}
                    assetData={asset.clients}
                    onSwitchChange={onClientSwitchChange}
                />
            </Tabs.Panel>
        </Tabs>
    );
};

export default TabsComponent;
