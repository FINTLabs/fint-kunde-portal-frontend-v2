import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ComponentToggleModal from './ComponentToggleModal';

describe('ComponentToggleModal', () => {
    it('allows immediate confirmation when activating a component', () => {
        const onConfirm = vi.fn();

        render(
            <ComponentToggleModal
                isOpen
                componentName="utdanning-larling"
                isChecked
                onConfirm={onConfirm}
                onCancel={vi.fn()}
            />
        );

        expect(
            screen.getByText('Er du sikker på at du vil aktivere denne komponenten?')
        ).toBeInTheDocument();
        expect(screen.getByText('utdanning-larling')).toBeInTheDocument();

        const confirmButton = screen.getByRole('button', { name: 'Ja, jeg er sikker' });
        expect(confirmButton).toBeEnabled();

        fireEvent.click(confirmButton);
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('requires typed component name before deactivation can be confirmed', () => {
        const onConfirm = vi.fn();

        render(
            <ComponentToggleModal
                isOpen
                componentName="utdanning-larling"
                isChecked={false}
                onConfirm={onConfirm}
                onCancel={vi.fn()}
            />
        );

        expect(
            screen.getByText('Er du sikker på at du vil deaktivere denne komponenten?')
        ).toBeInTheDocument();

        const confirmButton = screen.getByRole('button', { name: 'Ja, jeg er sikker' });
        expect(confirmButton).toBeDisabled();

        fireEvent.change(screen.getByRole('textbox', { name: 'Komponentnavn' }), {
            target: { value: 'utdanning-larling' },
        });
        expect(confirmButton).toBeEnabled();

        fireEvent.click(confirmButton);
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when Avbryt is clicked', () => {
        const onCancel = vi.fn();

        render(
            <ComponentToggleModal
                isOpen
                componentName="utdanning-larling"
                isChecked
                onConfirm={vi.fn()}
                onCancel={onCancel}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Avbryt' }));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});
