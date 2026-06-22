import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import TabsComponent from './TabsComponent';
import type { IAdapter } from '~/types/Adapter';
import type { IAsset } from '~/types/Asset';
import type { IClient } from '~/types/Clients';

function makeAsset(): IAsset {
    return {
        dn: 'dn-asset-1',
        name: 'asset-a',
        assetId: 'asset-id-1',
        description: 'Asset description',
        organisation: 'fint-org',
        clients: [],
        adapters: [],
        primaryAsset: false,
    };
}

function makeAdapter(name: string): IAdapter {
    return {
        dn: `dn-${name}`,
        name,
        shortDescription: `${name} desc`,
        note: '',
        clientId: 'client-a',
        components: [],
        assets: [],
        assetIds: [],
        managed: false,
    };
}

function makeClient(name: string): IClient {
    return {
        dn: `dn-${name}`,
        name,
        shortDescription: `${name} desc`,
        note: '',
        assetId: [],
        asset: '',
        clientId: name,
        components: [],
        accessPackages: [],
        managed: false,
    };
}

describe('TabsComponent', () => {
    it('renders adapter tab content by default', () => {
        render(
            <TabsComponent
                asset={makeAsset()}
                unmanagedAdapters={[makeAdapter('adapter-a')]}
                unmanagedClients={[makeClient('client-a')]}
                onAdapterSwitchChange={vi.fn()}
                onClientSwitchChange={vi.fn()}
            />
        );

        expect(screen.getByRole('tab', { name: 'Adaptere' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Klienter' })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'adapter-a' })).toBeInTheDocument();
    });

    it('shows client table when clients tab is selected', () => {
        render(
            <TabsComponent
                asset={makeAsset()}
                unmanagedAdapters={[makeAdapter('adapter-a')]}
                unmanagedClients={[makeClient('client-a')]}
                onAdapterSwitchChange={vi.fn()}
                onClientSwitchChange={vi.fn()}
            />
        );

        fireEvent.click(screen.getByRole('tab', { name: 'Klienter' }));

        expect(screen.getByRole('checkbox', { name: 'client-a' })).toBeInTheDocument();
    });

    it('forwards switch changes to adapter and client handlers', () => {
        const onAdapterSwitchChange = vi.fn();
        const onClientSwitchChange = vi.fn();

        render(
            <TabsComponent
                asset={makeAsset()}
                unmanagedAdapters={[makeAdapter('adapter-a')]}
                unmanagedClients={[makeClient('client-a')]}
                onAdapterSwitchChange={onAdapterSwitchChange}
                onClientSwitchChange={onClientSwitchChange}
            />
        );

        fireEvent.click(screen.getByRole('checkbox', { name: 'adapter-a' }));
        expect(onAdapterSwitchChange).toHaveBeenCalledWith('adapter-a', true);

        fireEvent.click(screen.getByRole('tab', { name: 'Klienter' }));
        fireEvent.click(screen.getByRole('checkbox', { name: 'client-a' }));
        expect(onClientSwitchChange).toHaveBeenCalledWith('client-a', true);
    });
});
