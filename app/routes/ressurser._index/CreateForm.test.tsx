import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import CreateForm from './CreateForm';
import type { IAsset } from '~/types/Asset';

function makePrimaryAsset(): IAsset {
    return {
        dn: 'dn-primary',
        name: 'primary-asset',
        assetId: 'fint-org-id',
        description: 'Primary asset',
        organisation: 'fint-org',
        clients: [],
        adapters: [],
        primaryAsset: true,
    };
}

describe('CreateForm', () => {
    it('shows primary asset id suffix', () => {
        render(
            <CreateForm onCancel={vi.fn()} onCreate={vi.fn()} primaryAsset={makePrimaryAsset()} />
        );

        expect(screen.getByText('fint-org-id')).toBeInTheDocument();
    });

    it('shows validation errors and does not submit when fields are missing', () => {
        const onCreate = vi.fn();

        render(
            <CreateForm onCancel={vi.fn()} onCreate={onCreate} primaryAsset={makePrimaryAsset()} />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Opprett' }));

        expect(screen.getByText('Navn er påkrevd')).toBeInTheDocument();
        expect(screen.getByText('Tittel er påkrevd')).toBeInTheDocument();
        expect(onCreate).not.toHaveBeenCalled();
    });

    it('submits filled values as FormData', () => {
        const onCreate = vi.fn();

        render(
            <CreateForm onCancel={vi.fn()} onCreate={onCreate} primaryAsset={makePrimaryAsset()} />
        );

        fireEvent.change(screen.getByLabelText('Navn'), { target: { value: 'asset-a' } });
        fireEvent.change(screen.getByLabelText('Tittel'), { target: { value: 'Asset title' } });
        fireEvent.click(screen.getByRole('button', { name: 'Opprett' }));

        expect(onCreate).toHaveBeenCalledTimes(1);

        const formData = onCreate.mock.calls[0][0] as FormData;
        expect(formData.get('name')).toBe('asset-a');
        expect(formData.get('description')).toBe('Asset title');
        expect(formData.get('orgName')).toBe('fint-org-id');
    });

    it('calls onCancel when Avbryt is clicked', () => {
        const onCancel = vi.fn();

        render(
            <CreateForm onCancel={onCancel} onCreate={vi.fn()} primaryAsset={makePrimaryAsset()} />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Avbryt' }));

        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});
