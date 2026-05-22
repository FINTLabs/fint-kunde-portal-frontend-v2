import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DetailView } from './DetailView';

vi.mock('~/components/shared/ConfirmActionModal', () => ({
    default: ({ onConfirm }: { onConfirm: () => void }) => (
        <button type="button" onClick={onConfirm}>
            confirm-delete
        </button>
    ),
}));

const baseResource = {
    name: 'adapter@fint.no',
    shortDescription: 'Kort',
    note: 'Notat',
    managed: false,
};

describe('DetailView', () => {
    it('renders adapter details in read-only mode', () => {
        render(<DetailView resource={baseResource} onUpdate={vi.fn()} onDelete={vi.fn()} />);

        expect(screen.getByRole('heading', { name: 'Detaljer' })).toBeInTheDocument();
        expect(screen.getByText('adapter@fint.no')).toBeInTheDocument();
        expect(screen.getByText('Kort')).toBeInTheDocument();
        expect(screen.getByText('Notat')).toBeInTheDocument();
    });

    it('updates adapter when values are changed and save is clicked', () => {
        const onUpdate = vi.fn();

        render(<DetailView resource={baseResource} onUpdate={onUpdate} onDelete={vi.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: 'Rediger' }));
        fireEvent.change(screen.getByRole('textbox', { name: 'Tittel' }), {
            target: { value: 'Ny kort' },
        });
        fireEvent.change(screen.getByRole('textbox', { name: 'Beskrivelse' }), {
            target: { value: 'Nytt notat' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(onUpdate).toHaveBeenCalledTimes(1);
        const formData = onUpdate.mock.calls[0][0] as FormData;
        expect(formData.get('shortDescription')).toBe('Ny kort');
        expect(formData.get('note')).toBe('Nytt notat');
    });

    it('does not call onUpdate when save has no changes', () => {
        const onUpdate = vi.fn();

        render(<DetailView resource={baseResource} onUpdate={onUpdate} onDelete={vi.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: 'Rediger' }));
        fireEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(onUpdate).not.toHaveBeenCalled();
    });

    it('calls onDelete and shows loader after delete confirmation', () => {
        const onDelete = vi.fn();

        render(<DetailView resource={baseResource} onUpdate={vi.fn()} onDelete={onDelete} />);

        fireEvent.click(screen.getByRole('button', { name: 'confirm-delete' }));

        expect(onDelete).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Venter...')).toBeInTheDocument();
    });

    it('disables edit and hides delete action for managed resources', () => {
        render(
            <DetailView
                resource={{ ...baseResource, managed: true }}
                onUpdate={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        expect(screen.getByRole('button', { name: 'Rediger' })).toBeDisabled();
        expect(screen.queryByRole('button', { name: 'confirm-delete' })).not.toBeInTheDocument();
    });
});
