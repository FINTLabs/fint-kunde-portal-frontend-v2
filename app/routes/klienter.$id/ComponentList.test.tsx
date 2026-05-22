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

import ComponentList from './ComponentList';

describe('ComponentList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const accessList = [
        {
            domain: 'utdanning',
            packages: [
                {
                    packageName: 'larling',
                    access: true,
                    hasResourceAccess: 'FULLACCESS' as const,
                },
                {
                    packageName: 'elev',
                    access: false,
                    hasResourceAccess: 'NOACCESS' as const,
                },
            ],
        },
    ];

    it('renders capitalized domain and package names', () => {
        render(<ComponentList accessList={accessList} entity="client-a" onToggle={vi.fn()} />);

        expect(screen.getByRole('heading', { name: 'Utdanning' })).toBeInTheDocument();
        expect(screen.getByText('larling')).toBeInTheDocument();
        expect(screen.getByText('elev')).toBeInTheDocument();
    });

    it('calls onToggle with component name and checked state', () => {
        const onToggle = vi.fn();

        render(<ComponentList accessList={accessList} entity="client-a" onToggle={onToggle} />);

        fireEvent.click(screen.getByRole('checkbox', { name: 'larling' }));

        expect(onToggle).toHaveBeenCalledTimes(1);
        const formData = onToggle.mock.calls[0][0] as FormData;
        expect(formData.get('componentName')).toBe('utdanning-larling');
        expect(formData.get('isChecked')).toBe('false');
    });

    it('navigates to access details when enabled package button is clicked', () => {
        render(<ComponentList accessList={accessList} entity="client-a" onToggle={vi.fn()} />);

        fireEvent.click(screen.getAllByRole('button', { name: 'Rediger' })[0]);

        expect(mockNavigate).toHaveBeenCalledWith('/tilgang/client-a/utdanning-larling');
    });

    it('disables details button when package access is false', () => {
        render(<ComponentList accessList={accessList} entity="client-a" onToggle={vi.fn()} />);

        expect(screen.getAllByRole('button', { name: 'Rediger' })[1]).toBeDisabled();
    });
});
