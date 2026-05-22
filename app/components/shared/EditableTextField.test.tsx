import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { EditableTextField } from './EditableTextField';

describe('EditableTextField', () => {
    it('renders label and value in read-only mode', () => {
        const setValue = vi.fn();

        render(
            <EditableTextField label="Beskrivelse" value="Kort tekst" isEditing={false} setValue={setValue} />
        );

        expect(screen.getByText('Beskrivelse')).toBeInTheDocument();
        expect(screen.getByText('Kort tekst')).toBeInTheDocument();
        expect(screen.queryByRole('textbox', { name: 'Beskrivelse' })).not.toBeInTheDocument();
    });

    it('renders text input and updates value in edit mode', () => {
        const setValue = vi.fn();

        render(
            <EditableTextField
                label="Beskrivelse"
                value="Kort tekst"
                isEditing={true}
                setValue={setValue}
            />
        );

        const input = screen.getByRole('textbox', { name: 'Beskrivelse' });
        expect(input).toHaveValue('Kort tekst');

        fireEvent.change(input, { target: { value: 'Ny tekst' } });
        expect(setValue).toHaveBeenCalledWith('Ny tekst');
    });
});
