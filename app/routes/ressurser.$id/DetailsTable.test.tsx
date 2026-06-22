import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import DetailsTable from './DetailsTable';
import type { IAdapter } from '~/types/Adapter';
import type { IAsset } from '~/types/Asset';
import type { IClient } from '~/types/Clients';

function makeAsset(overrides: Partial<IAsset> = {}): IAsset {
    return {
        dn: 'dn-asset-1',
        name: 'asset-a',
        assetId: 'asset-id-1',
        description: 'Asset description',
        organisation: 'fint-org',
        clients: ['dn-client-1'],
        adapters: ['dn-adapter-1'],
        primaryAsset: false,
        ...overrides,
    };
}

function makeAdapter(overrides: Partial<IAdapter> = {}): IAdapter {
    return {
        dn: 'dn-adapter-1',
        name: 'adapter-a',
        shortDescription: 'Adapter A',
        note: '',
        clientId: 'client-a',
        components: [],
        assets: [],
        assetIds: [],
        managed: false,
        ...overrides,
    };
}

function makeClient(overrides: Partial<IClient> = {}): IClient {
    return {
        dn: 'dn-client-1',
        name: 'client-a',
        shortDescription: 'Client A',
        note: '',
        assetId: [],
        asset: '',
        clientId: 'client-a',
        components: [],
        accessPackages: [],
        managed: false,
        ...overrides,
    };
}

describe('DetailsTable', () => {
    it('renders adapter rows with connection state', () => {
        render(
            <DetailsTable
                data={[
                    makeAdapter(),
                    makeAdapter({
                        dn: 'dn-adapter-2',
                        name: 'adapter-b',
                        shortDescription: 'Adapter B',
                    }),
                ]}
                assetData={makeAsset({ adapters: ['dn-adapter-1'] })}
                onSwitchChange={vi.fn()}
                isClient={false}
            />
        );

        expect(screen.getByRole('checkbox', { name: 'adapter-a' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'adapter-b' })).not.toBeChecked();
        expect(screen.getByText('Adapter A')).toBeInTheDocument();
        expect(screen.getByText('Adapter B')).toBeInTheDocument();
    });

    it('calls onSwitchChange when adapter switch is toggled', () => {
        const onSwitchChange = vi.fn();

        render(
            <DetailsTable
                data={[makeAdapter()]}
                assetData={makeAsset({ adapters: [] })}
                onSwitchChange={onSwitchChange}
                isClient={false}
            />
        );

        fireEvent.click(screen.getByRole('checkbox', { name: 'adapter-a' }));

        expect(onSwitchChange).toHaveBeenCalledWith('adapter-a', true);
    });

    it('uses client connections when isClient is true', () => {
        const onSwitchChange = vi.fn();

        render(
            <DetailsTable
                data={[makeClient(), makeClient({ dn: 'dn-client-2', name: 'client-b' })]}
                assetData={makeAsset({ clients: ['dn-client-1'] })}
                onSwitchChange={onSwitchChange}
                isClient={true}
            />
        );

        expect(screen.getByRole('checkbox', { name: 'client-a' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'client-b' })).not.toBeChecked();

        fireEvent.click(screen.getByRole('checkbox', { name: 'client-b' }));

        expect(onSwitchChange).toHaveBeenCalledWith('client-b', true);
    });
});
