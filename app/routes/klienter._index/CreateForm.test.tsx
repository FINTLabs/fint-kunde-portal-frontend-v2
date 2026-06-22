import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AnalyticsApi from '~/api/AnalyticsApi';

import ClientCreateForm from './CreateForm';

vi.mock('~/api/AnalyticsApi', () => ({
    default: {
        trackButtonClick: vi.fn(),
    },
}));

vi.mock('react-router', () => ({
    useOutletContext: () => ({ selectedOrganization: { name: 'fint-org' } }),
}));

describe('ClientCreateForm', () => {
    it('shows organization suffix with underscores replaced by dots', () => {
        render(
            <ClientCreateForm
                onCancel={vi.fn()}
                onSave={vi.fn()}
                orgName="fint_test_org"
                isSubmitting={false}
                clientData={[]}
            />
        );

        expect(screen.getByText('@client.fint.test.org')).toBeInTheDocument();
    });

    it('shows validation errors and does not submit when fields are missing', () => {
        const onSave = vi.fn();
        render(
            <ClientCreateForm
                onCancel={vi.fn()}
                onSave={onSave}
                orgName="fint_org"
                isSubmitting={false}
                clientData={[]}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Opprett' }));

        expect(screen.getByText('Navn er påkrevd')).toBeInTheDocument();
        expect(screen.getByText('Tittel er påkrevd')).toBeInTheDocument();
        expect(screen.getByText('Detaljert informasjon er påkrevd')).toBeInTheDocument();
        expect(onSave).not.toHaveBeenCalled();
    });

    it('shows error when client name already exists', () => {
        const onSave = vi.fn();
        render(
            <ClientCreateForm
                onCancel={vi.fn()}
                onSave={onSave}
                orgName="fint_org"
                isSubmitting={false}
                clientData={[{ name: 'existing-client' } as any]}
            />
        );

        fireEvent.change(screen.getByLabelText('Navn'), { target: { value: 'existing-client' } });
        fireEvent.change(screen.getByLabelText('Tittel'), { target: { value: 'Min klient' } });
        fireEvent.change(screen.getByLabelText('Beskrivelse'), {
            target: { value: 'Detaljert beskrivelse' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Opprett' }));

        expect(screen.getByText('Klienten eksisterer allerede')).toBeInTheDocument();
        expect(onSave).not.toHaveBeenCalled();
    });

    it('submits filled values as FormData', () => {
        const onSave = vi.fn();
        render(
            <ClientCreateForm
                onCancel={vi.fn()}
                onSave={onSave}
                orgName="fint_org"
                isSubmitting={false}
                clientData={[]}
            />
        );

        fireEvent.change(screen.getByLabelText('Navn'), { target: { value: 'my-client' } });
        fireEvent.change(screen.getByLabelText('Tittel'), { target: { value: 'Min klient' } });
        fireEvent.change(screen.getByLabelText('Beskrivelse'), {
            target: { value: 'Detaljert beskrivelse' },
        });
        fireEvent.change(screen.getByLabelText('Velg modelversjon'), { target: { value: 'V4' } });
        fireEvent.click(screen.getByRole('button', { name: 'Opprett' }));

        expect(AnalyticsApi.trackButtonClick).toHaveBeenCalledWith(
            'client-create-button',
            '/klienter',
            'fint-org',
            { inputName: 'my-client' }
        );
        expect(onSave).toHaveBeenCalledTimes(1);

        const formData = onSave.mock.calls[0][0] as FormData;
        expect(formData.get('name')).toBe('my-client');
        expect(formData.get('description')).toBe('Min klient');
        expect(formData.get('note')).toBe('Detaljert beskrivelse');
        expect(formData.get('modelVersion')).toBe('V4');
    });

    it('calls onCancel when Avbryt is clicked', () => {
        const onCancel = vi.fn();
        render(
            <ClientCreateForm
                onCancel={onCancel}
                onSave={vi.fn()}
                orgName="fint_org"
                isSubmitting={false}
                clientData={[]}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Avbryt' }));

        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});
