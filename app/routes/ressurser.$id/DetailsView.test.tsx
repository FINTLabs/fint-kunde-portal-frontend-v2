import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DetailsView } from './DetailsView';
import type { IAsset } from '~/types/Asset';

vi.mock('~/components/shared/ConfirmActionModal', () => ({
    default: ({ onConfirm }: { onConfirm: () => void }) => (
        <button type="button" onClick={onConfirm}>
            confirm-delete
        </button>
    ),
}));

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

describe('DetailsView', () => {
    it('renders asset details in read-only mode', () => {
        render(<DetailsView asset={makeAsset()} onUpdate={vi.fn()} onDelete={vi.fn()} />);

        expect(screen.getByRole('heading', { name: 'Detaljer' })).toBeInTheDocument();
        expect(screen.getByText('asset-a')).toBeInTheDocument();
        expect(screen.getByText('asset-id-1')).toBeInTheDocument();
        expect(screen.getByText('Asset description')).toBeInTheDocument();
    });

    it('shows primary asset indicator and hides edit controls for primary assets', () => {
        render(
            <DetailsView
                asset={makeAsset({ primaryAsset: true })}
                onUpdate={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        expect(screen.getByText('Primær ressurs')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Rediger' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'confirm-delete' })).not.toBeInTheDocument();
    });

    it('calls onUpdate with changed description when saved', () => {
        const onUpdate = vi.fn();

        render(<DetailsView asset={makeAsset()} onUpdate={onUpdate} onDelete={vi.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: 'Rediger' }));
        fireEvent.change(screen.getByRole('textbox', { name: 'Beskrivelse' }), {
            target: { value: 'Updated description' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(onUpdate).toHaveBeenCalledTimes(1);
        const formData = onUpdate.mock.calls[0][0] as FormData;
        expect(formData.get('assetDescription')).toBe('Updated description');
    });

    it('does not call onUpdate when description is unchanged', () => {
        const onUpdate = vi.fn();

        render(<DetailsView asset={makeAsset()} onUpdate={onUpdate} onDelete={vi.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: 'Rediger' }));
        fireEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(onUpdate).not.toHaveBeenCalled();
    });

    it('restores description and exits edit mode on cancel', () => {
        render(<DetailsView asset={makeAsset()} onUpdate={vi.fn()} onDelete={vi.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: 'Rediger' }));
        fireEvent.change(screen.getByRole('textbox', { name: 'Beskrivelse' }), {
            target: { value: 'Temporary change' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Avbryt' }));

        expect(screen.getByText('Asset description')).toBeInTheDocument();
        expect(screen.queryByRole('textbox', { name: 'Beskrivelse' })).not.toBeInTheDocument();
    });

    it('calls onDelete when delete is confirmed', () => {
        const onDelete = vi.fn();

        render(<DetailsView asset={makeAsset()} onUpdate={vi.fn()} onDelete={onDelete} />);

        fireEvent.click(screen.getByRole('button', { name: 'confirm-delete' }));

        expect(onDelete).toHaveBeenCalledTimes(1);
    });
});
