import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import IconToggleButtons from './IconToggleButtons';
import type { IResource } from '~/types/Access';

vi.mock('~/components/shared/ConfirmActionModal', () => ({
    default: ({
        buttonText,
        onConfirm,
    }: {
        buttonText?: string;
        onConfirm: () => void;
    }) => (
        <button type="button" onClick={onConfirm}>
            {buttonText}
        </button>
    ),
}));

function makeResource(overrides: Partial<IResource> = {}): IResource {
    return {
        name: 'elev',
        enabled: true,
        writeable: false,
        readingOption: 'MULTIPLE',
        ...overrides,
    };
}

describe('IconToggleButtons', () => {
    it('calls writeable handler from confirm button', () => {
        const onClickIsWriteable = vi.fn();

        render(
            <IconToggleButtons
                resource={makeResource()}
                onClickIsWriteable={onClickIsWriteable}
                onClickReadingOptions={vi.fn()}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Gi skriverettighet' }));

        expect(onClickIsWriteable).toHaveBeenCalledTimes(1);
    });

    it('calls reading options handler from confirm button', () => {
        const onClickReadingOptions = vi.fn();

        render(
            <IconToggleButtons
                resource={makeResource({ readingOption: 'SINGULAR' })}
                onClickIsWriteable={vi.fn()}
                onClickReadingOptions={onClickReadingOptions}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Tillat flere oppslag' }));

        expect(onClickReadingOptions).toHaveBeenCalledTimes(1);
    });

    it('shows remove write access label when resource is writeable', () => {
        render(
            <IconToggleButtons
                resource={makeResource({ writeable: true })}
                onClickIsWriteable={vi.fn()}
                onClickReadingOptions={vi.fn()}
            />
        );

        expect(screen.getByRole('button', { name: 'Fjern skriverettighet' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Kun enkeltoppslag' })).toBeInTheDocument();
    });
});
