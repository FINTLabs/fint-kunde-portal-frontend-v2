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
    managedAdapters: IAdapter[];
    unmanagedAdapters: IAdapter[];
    managedClients: IClient[];
    unmanagedClients: IClient[];
    onAdapterSwitchChange: (adapterName: string, isChecked: boolean) => void;
    onClientSwitchChange: (clientName: string, isChecked: boolean) => void;
}

const TabsComponent: React.FC<TabsComponentProps> = ({
    asset,
    managedAdapters,
    unmanagedAdapters,
    managedClients,
    unmanagedClients,
    onAdapterSwitchChange,
    onClientSwitchChange,
}) => {
    return (
        <Tabs defaultValue="managed" fill>
            <Tabs.List>
                <Tabs.Tab
                    value="managed"
                    label="Automatisk Adapters"
                    icon={<BriefcaseIcon aria-hidden />}
                />
                <Tabs.Tab
                    value="unmanaged"
                    label="Manuelt Adapters"
                    icon={<BriefcaseIcon aria-hidden />}
                />
                <Tabs.Tab
                    value="managedClients"
                    label="Automatisk Klienter"
                    icon={<ComponentIcon aria-hidden />}
                />
                <Tabs.Tab
                    value="unmanagedClients"
                    label="Manuelt Klienter"
                    icon={<ComponentIcon aria-hidden />}
                />
            </Tabs.List>
            <Tabs.Panel value="managed" className="w-full">
                <DetailsTable
                    data={managedAdapters}
                    assetData={asset.adapters}
                    onSwitchChange={onAdapterSwitchChange}
                />
            </Tabs.Panel>
            <Tabs.Panel value="unmanaged" className="w-full">
                <DetailsTable
                    data={unmanagedAdapters}
                    assetData={asset.adapters}
                    onSwitchChange={onAdapterSwitchChange}
                />
            </Tabs.Panel>
            <Tabs.Panel value="managedClients" className="w-full">
                <DetailsTable
                    data={managedClients}
                    assetData={asset.clients}
                    onSwitchChange={onClientSwitchChange}
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
