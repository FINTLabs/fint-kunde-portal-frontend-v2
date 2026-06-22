import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AnalyticsApi from '~/api/AnalyticsApi';

import { DetailView } from './DetailView';

vi.mock('~/api/AnalyticsApi', () => ({
    default: {
        trackButtonClick: vi.fn(),
    },
}));

vi.mock('react-router', () => ({
    useOutletContext: () => ({ selectedOrganization: { name: 'org-1' } }),
    useLocation: () => ({ pathname: '/klienter/client-a' }),
}));

vi.mock('~/components/shared/ConfirmActionModal', () => ({
    default: ({ onConfirm }: { onConfirm: () => void }) => (
        <button type="button" onClick={onConfirm}>
            confirm-delete
        </button>
    ),
}));

const baseResource = {
    name: 'client-a',
    shortDescription: 'Kort',
    note: 'Notat',
    modelVersion: 'V3',
    managed: false,
    lastLoginTime: '2024-01-01T10:00:00',
};

describe('DetailView', () => {
    it('renders client details in read-only mode', () => {
        render(<DetailView resource={baseResource as any} onUpdate={vi.fn()} onDelete={vi.fn()} />);

        expect(screen.getByRole('heading', { name: 'Detaljer' })).toBeInTheDocument();
        expect(screen.getByText('client-a')).toBeInTheDocument();
        expect(screen.getByText('Kort')).toBeInTheDocument();
        expect(screen.getByText('Notat')).toBeInTheDocument();
        expect(screen.getByText('V3')).toBeInTheDocument();
        expect(screen.getByText('2024-01-01T10:00:00')).toBeInTheDocument();
    });

    it('updates client when values are changed and save is clicked', () => {
        const onUpdate = vi.fn();

        render(<DetailView resource={baseResource as any} onUpdate={onUpdate} onDelete={vi.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: 'Rediger' }));
        fireEvent.change(screen.getByRole('textbox', { name: 'Tittel' }), {
            target: { value: 'Ny kort' },
        });
        fireEvent.change(screen.getByRole('textbox', { name: 'Beskrivelse' }), {
            target: { value: 'Nytt notat' },
        });
        fireEvent.change(screen.getByLabelText('Velg modelversjon'), {
            target: { value: 'V4' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(AnalyticsApi.trackButtonClick).toHaveBeenCalledWith(
            'client-save-changes-button',
            '/klienter/:id',
            'org-1',
            { id: 'client-a', rawPath: '/klienter/client-a' }
        );
        expect(onUpdate).toHaveBeenCalledTimes(1);

        const formData = onUpdate.mock.calls[0][0] as FormData;
        expect(formData.get('shortDescription')).toBe('Ny kort');
        expect(formData.get('note')).toBe('Nytt notat');
        expect(formData.get('modelVersion')).toBe('V4');
    });

    it('does not call onUpdate when save has no changes', () => {
        const onUpdate = vi.fn();

        render(<DetailView resource={baseResource as any} onUpdate={onUpdate} onDelete={vi.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: 'Rediger' }));
        fireEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(onUpdate).not.toHaveBeenCalled();
    });

    it('calls onDelete and shows loader after delete confirmation', () => {
        const onDelete = vi.fn();

        render(<DetailView resource={baseResource as any} onUpdate={vi.fn()} onDelete={onDelete} />);

        fireEvent.click(screen.getByRole('button', { name: 'confirm-delete' }));

        expect(onDelete).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Venter...')).toBeInTheDocument();
    });

    it('disables edit and hides delete action for managed resources', () => {
        render(
            <DetailView
                resource={{ ...baseResource, managed: true } as any}
                onUpdate={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        expect(screen.getByRole('button', { name: 'Rediger' })).toBeDisabled();
        expect(screen.queryByRole('button', { name: 'confirm-delete' })).not.toBeInTheDocument();
    });
});
