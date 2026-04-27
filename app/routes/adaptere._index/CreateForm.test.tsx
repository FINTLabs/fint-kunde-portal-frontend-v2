import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AdapterCreateForm from './CreateForm';

describe('AdapterCreateForm', () => {
    it('shows organization suffix with underscores replaced by dots', () => {
        render(<AdapterCreateForm onCancel={vi.fn()} onSave={vi.fn()} orgName="fint_test_org" />);

        expect(screen.getByText('@adapter.fint.test.org')).toBeInTheDocument();
    });

    it('shows validation errors and does not submit when fields are missing', () => {
        const onSave = vi.fn();
        render(<AdapterCreateForm onCancel={vi.fn()} onSave={onSave} orgName="fint_org" />);

        fireEvent.click(screen.getByRole('button', { name: 'Opprett' }));

        expect(screen.getByText('Navn er påkrevd')).toBeInTheDocument();
        expect(screen.getByText('Tittel er påkrevd')).toBeInTheDocument();
        expect(screen.getByText('Detaljert informasjon er påkrevd')).toBeInTheDocument();
        expect(onSave).not.toHaveBeenCalled();
    });

    it('submits filled values as FormData', () => {
        const onSave = vi.fn();
        render(<AdapterCreateForm onCancel={vi.fn()} onSave={onSave} orgName="fint_org" />);

        fireEvent.change(screen.getByLabelText('Navn'), { target: { value: 'my-adapter' } });
        fireEvent.change(screen.getByLabelText('Tittel'), { target: { value: 'Min adapter' } });
        fireEvent.change(screen.getByLabelText('Beskrivelse'), {
            target: { value: 'Detaljert beskrivelse' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Opprett' }));

        expect(onSave).toHaveBeenCalledTimes(1);

        const formData = onSave.mock.calls[0][0] as FormData;
        expect(formData.get('name')).toBe('my-adapter');
        expect(formData.get('description')).toBe('Min adapter');
        expect(formData.get('detailedInfo')).toBe('Detaljert beskrivelse');
    });

    it('calls onCancel when Avbryt is clicked', () => {
        const onCancel = vi.fn();
        render(<AdapterCreateForm onCancel={onCancel} onSave={vi.fn()} orgName="fint_org" />);

        fireEvent.click(screen.getByRole('button', { name: 'Avbryt' }));

        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});
