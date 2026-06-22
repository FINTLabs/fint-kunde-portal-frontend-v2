import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LoginStatusIcon } from './LoginStatusIcon';

vi.mock('@navikt/ds-react', async () => {
    const actual = await vi.importActual<typeof import('@navikt/ds-react')>('@navikt/ds-react');
    return {
        ...actual,
        Tooltip: ({ content, children }: { content: string; children: React.ReactNode }) => (
            <div>
                <span>{content}</span>
                {children}
            </div>
        ),
    };
});

describe('LoginStatusIcon', () => {
    it('shows info tooltip when no login is registered', () => {
        render(<LoginStatusIcon lastLoginTime={null} />);
        expect(screen.getByText('Ingen innlogging registrert')).toBeInTheDocument();
    });

    it('shows invalid time tooltip for malformed date', () => {
        render(<LoginStatusIcon lastLoginTime="not-a-date" />);
        expect(screen.getByText('Ugyldig innloggingstid')).toBeInTheDocument();
    });

    it('shows stale login tooltip when older than 30 days', () => {
        const oldDate = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
        render(<LoginStatusIcon lastLoginTime={oldDate} />);
        expect(screen.getByText('Sist innlogget for mer enn 30 dager siden')).toBeInTheDocument();
    });

    it('shows recent login tooltip for fresh logins', () => {
        const recentDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
        render(<LoginStatusIcon lastLoginTime={recentDate} />);
        expect(screen.getByText('Nylig innlogging')).toBeInTheDocument();
    });
});
