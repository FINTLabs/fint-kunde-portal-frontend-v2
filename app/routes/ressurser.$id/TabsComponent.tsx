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
        <Tabs defaultValue="unmanagedAdapters" fill>
            <Tabs.List>
                <Tabs.Tab
                    data-cy={`tab-item-0`}
                    value="unmanagedAdapters"
                    label="Adaptere"
                    icon={<BriefcaseIcon aria-hidden />}
                />
                <Tabs.Tab
                    data-cy={`tab-item-1`}
                    value="unmanagedClients"
                    label="Klienter"
                    icon={<ComponentIcon aria-hidden />}
                />
            </Tabs.List>
            <Tabs.Panel value="unmanagedAdapters" className="w-full">
                <DetailsTable
                    data={unmanagedAdapters}
                    assetData={asset}
                    onSwitchChange={onAdapterSwitchChange}
                    isClient={false}
                />
            </Tabs.Panel>
            <Tabs.Panel value="unmanagedClients" className="w-full">
                <DetailsTable
                    data={unmanagedClients}
                    assetData={asset}
                    onSwitchChange={onClientSwitchChange}
                    isClient={true}
                />
            </Tabs.Panel>
        </Tabs>
    );
};

export default TabsComponent;
