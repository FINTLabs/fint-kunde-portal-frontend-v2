import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ConfirmAction from './ConfirmActionModal';

describe('ConfirmAction', () => {
    it('opens modal and confirms action', () => {
        const onConfirm = vi.fn();

        render(
            <ConfirmAction
                buttonText="Slett"
                subTitleText="Er du sikker?"
                titleText="Bekreft sletting"
                onConfirm={onConfirm}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Slett' }));
        expect(screen.getByText('Bekreft sletting')).toBeInTheDocument();
        expect(screen.getByText('Er du sikker?')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Ja, jeg er sikker' }));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('closes modal without calling onConfirm when cancelled', () => {
        const onConfirm = vi.fn();

        render(
            <ConfirmAction
                buttonText="Slett"
                subTitleText="Er du sikker?"
                titleText="Bekreft sletting"
                onConfirm={onConfirm}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Slett' }));
        fireEvent.click(screen.getByRole('button', { name: 'Avbryt' }));

        expect(onConfirm).not.toHaveBeenCalled();
    });
});
