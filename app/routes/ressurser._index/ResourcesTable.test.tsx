import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AssetsTable from './ResourcesTable';
import type { IAsset } from '~/types/Asset';

function makeAsset(overrides: Partial<IAsset> = {}): IAsset {
    return {
        dn: 'dn-asset-1',
        name: 'asset-a',
        assetId: 'asset-id-1',
        description: 'Asset description',
        organisation: 'fint-org',
        clients: [],
        adapters: [],
        primaryAsset: false,
        ...overrides,
    };
}

describe('ResourcesTable', () => {
    it('renders asset rows with description', () => {
        render(
            <AssetsTable
                assets={[
                    makeAsset(),
                    makeAsset({
                        name: 'asset-b',
                        description: 'Second asset',
                        primaryAsset: true,
                    }),
                ]}
                onRowClick={vi.fn()}
            />
        );

        expect(screen.getByText('asset-a')).toBeInTheDocument();
        expect(screen.getByText('Asset description')).toBeInTheDocument();
        expect(screen.getByText('asset-b')).toBeInTheDocument();
        expect(screen.getByText('Second asset')).toBeInTheDocument();
        expect(screen.getByText('[PRIMARY]')).toBeInTheDocument();
    });

    it('calls onRowClick when row is clicked', () => {
        const onRowClick = vi.fn();

        render(<AssetsTable assets={[makeAsset()]} onRowClick={onRowClick} />);

        fireEvent.click(screen.getByText('asset-a'));

        expect(onRowClick).toHaveBeenCalledWith('asset-a');
    });

    it('calls onRowClick when edit button is clicked', () => {
        const onRowClick = vi.fn();

        render(<AssetsTable assets={[makeAsset()]} onRowClick={onRowClick} />);

        fireEvent.click(screen.getByRole('button', { name: 'Rediger' }));

        expect(onRowClick).toHaveBeenCalledWith('asset-a');
    });
});
