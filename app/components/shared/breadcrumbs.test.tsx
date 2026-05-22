import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Breadcrumbs from './breadcrumbs';

const { mockUseLocation } = vi.hoisted(() => ({
    mockUseLocation: vi.fn(),
}));

vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router');
    return {
        ...actual,
        useLocation: () => mockUseLocation(),
    };
});

describe('Breadcrumbs', () => {
    it('renders current path breadcrumb as plain text', () => {
        mockUseLocation.mockReturnValue({ pathname: '/adapter/adapter@fint.no', search: '?tab=1' });

        render(
            <Breadcrumbs
                breadcrumbs={[
                    { name: 'Adaptere', link: '/adaptere' },
                    { name: 'Detaljer', link: '/adapter/adapter@fint.no?tab=1' },
                ]}
            />
        );

        expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Adaptere' })).toHaveAttribute('href', '/adaptere');
        expect(screen.getByText('Detaljer')).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Detaljer' })).not.toBeInTheDocument();
    });

    it('renders encoded links as clickable breadcrumbs', () => {
        mockUseLocation.mockReturnValue({ pathname: '/adapter/æøå', search: '' });

        render(<Breadcrumbs breadcrumbs={[{ name: 'Nåværende', link: '/adapter/%C3%A6%C3%B8%C3%A5' }]} />);

        expect(screen.getByRole('link', { name: 'Nåværende' })).toHaveAttribute(
            'href',
            '/adapter/%C3%A6%C3%B8%C3%A5'
        );
    });
});
