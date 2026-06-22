import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

import ComponentsTable from './ComponentsTable';
import type { IComponent } from '~/types/Component';

function makeComponent(overrides: Partial<IComponent> = {}): IComponent {
    return {
        dn: 'dn-1',
        name: 'utdanning-larling',
        description: 'FINT Utdanning',
        organisations: ['fint-org'],
        clients: [],
        adapters: [],
        basePath: '/utdanning/larling',
        port: null,
        core: false,
        openData: false,
        common: false,
        cacheDisabledFor: [],
        inProduction: true,
        inBeta: false,
        inPlayWithFint: false,
        ...overrides,
    };
}

describe('ComponentsTable', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('groups components by base path and capitalizes special names', () => {
        render(
            <ComponentsTable
                items={[
                    makeComponent(),
                    makeComponent({
                        name: 'okonomi-faktura',
                        description: 'FINT Faktura',
                        basePath: '/okonomi/faktura',
                    }),
                ]}
                selectedItems={[]}
                isManaged={false}
            />
        );

        expect(screen.getByRole('heading', { name: 'Utdanning' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Økonomi' })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'Utdanning' })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'Faktura' })).toBeInTheDocument();
    });

    it('opens confirmation modal and submits toggle on confirm', () => {
        const toggle = vi.fn();

        render(
            <ComponentsTable
                items={[makeComponent()]}
                selectedItems={[]}
                toggle={toggle}
                isManaged={false}
            />
        );

        fireEvent.click(screen.getByRole('checkbox', { name: 'Utdanning' }));
        expect(
            screen.getByText('Er du sikker på at du vil aktivere denne komponenten?')
        ).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Ja, jeg er sikker' }));

        expect(toggle).toHaveBeenCalledTimes(1);
        const formData = toggle.mock.calls[0][0] as FormData;
        expect(formData.get('componentName')).toBe('utdanning-larling');
        expect(formData.get('isChecked')).toBe('true');
    });

    it('skips modal and toggles immediately when opened from client', () => {
        const toggle = vi.fn();

        render(
            <ComponentsTable
                items={[makeComponent()]}
                selectedItems={['utdanning-larling']}
                toggle={toggle}
                isManaged={false}
                fromClient="client-a"
            />
        );

        fireEvent.click(screen.getByRole('checkbox', { name: 'Utdanning' }));

        expect(
            screen.queryByText('Er du sikker på at du vil deaktivere denne komponenten?')
        ).not.toBeInTheDocument();
        expect(toggle).toHaveBeenCalledTimes(1);

        const formData = toggle.mock.calls[0][0] as FormData;
        expect(formData.get('componentName')).toBe('utdanning-larling');
        expect(formData.get('isChecked')).toBe('false');
    });

    it('navigates to component details with source query params', () => {
        render(
            <ComponentsTable
                items={[makeComponent()]}
                selectedItems={[]}
                isManaged={false}
                fromAdapter="adapter-a"
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Rediger' }));

        expect(mockNavigate).toHaveBeenCalledWith(
            '/komponenter/utdanning-larling?fromAdapter=adapter-a'
        );
    });

    it('disables toggles and navigation for managed resources', () => {
        render(
            <ComponentsTable items={[makeComponent()]} selectedItems={[]} isManaged toggle={vi.fn()} />
        );

        expect(screen.getByRole('checkbox', { name: 'Utdanning' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Rediger' })).toBeDisabled();
    });
});
