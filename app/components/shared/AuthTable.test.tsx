import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AuthTable } from './AuthTable';

vi.mock('~/components/shared/ConfirmActionModal', () => ({
    default: ({ onConfirm }: { onConfirm: () => void }) => (
        <button type="button" onClick={onConfirm}>
            generate-password
        </button>
    ),
}));

describe('AuthTable', () => {
    it('renders adapter auth fields and triggers auth info fetch', () => {
        const onUpdatePassword = vi.fn();
        const onUpdateAuthInfo = vi.fn();

        render(
            <AuthTable
                entity={{
                    name: 'adapter@fint.no',
                    shortDescription: '',
                    note: '',
                    dn: '',
                    clientId: 'client-id-1',
                    components: [],
                    assets: [],
                    assetIds: ['asset-a', 'asset-b'],
                    managed: false,
                }}
                entityType="adapter"
                onUpdatePassword={onUpdatePassword}
                onUpdateAuthInfo={onUpdateAuthInfo}
                clientSecret="secret-123"
            />
        );

        expect(screen.getByText('adapter@fint.no')).toBeInTheDocument();
        expect(screen.getByText('client-id-1')).toBeInTheDocument();
        expect(screen.getByText('asset-a, asset-b')).toBeInTheDocument();
        expect(screen.getByText('secret-123')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /Trykk for å hente hemmeligheten/i }));
        expect(onUpdateAuthInfo).toHaveBeenCalledTimes(1);
        const formData = onUpdateAuthInfo.mock.calls[0][0] as FormData;
        expect(formData.get('entityName')).toBe('adapter@fint.no');
    });

    it('generates password and submits update payload', () => {
        const onUpdatePassword = vi.fn();
        const onUpdateAuthInfo = vi.fn();

        const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);

        render(
            <AuthTable
                entity={{
                    name: 'client@fint.no',
                    shortDescription: '',
                    note: '',
                    dn: '',
                    clientId: 'client-id-2',
                    components: [],
                    accessPackages: [],
                    asset: '',
                    assetId: ['single-asset'],
                    managed: false,
                }}
                entityType="client"
                onUpdatePassword={onUpdatePassword}
                onUpdateAuthInfo={onUpdateAuthInfo}
                clientSecret="secret-999"
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'generate-password' }));

        expect(onUpdatePassword).toHaveBeenCalledTimes(1);
        const formData = onUpdatePassword.mock.calls[0][0] as FormData;
        expect(formData.get('entityName')).toBe('client@fint.no');
        expect(formData.get('password')).toBe('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

        randomSpy.mockRestore();
    });
});
