import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ComponentAccessAudit from './ComponentAccessAudit';

vi.mock('~/utils/dateUtils', () => ({
    formatDate: (ts: number) => `formatted(${ts})`,
}));

describe('ComponentAccessAudit', () => {
    it('renders empty state when audit is missing', () => {
        render(<ComponentAccessAudit audit={null} />);

        expect(screen.getByText('Ingen endringer registrert')).toBeInTheDocument();
    });

    it('renders audit records with formatted values', () => {
        render(
            <ComponentAccessAudit
                audit={{
                    userName: 'client-a',
                    auditRecord: [
                        {
                            portalUser: 'admin',
                            timeStamp: 1000,
                            changes: {
                                changed: 'COMPONENT',
                                name: 'utdanning-larling',
                                setTo: true,
                            },
                        },
                        {
                            portalUser: 'admin',
                            timeStamp: 2000,
                            changes: {
                                changed: 'RESOURCE',
                                name: 'Elev',
                                setTo: false,
                            },
                        },
                    ],
                }}
            />
        );

        expect(screen.getByText('Endringslogg for client-a (2 endringer)')).toBeInTheDocument();
        expect(screen.getByText('formatted(1000)')).toBeInTheDocument();
        expect(screen.getByText('Komponent')).toBeInTheDocument();
        expect(screen.getByText('Ressurs')).toBeInTheDocument();
        expect(screen.getByText('Aktivert')).toBeInTheDocument();
        expect(screen.getByText('Deaktivert')).toBeInTheDocument();
    });

    it('shows only first 10 records until full log is requested', () => {
        const auditRecord = Array.from({ length: 12 }, (_, index) => ({
            portalUser: 'admin',
            timeStamp: index + 1,
            changes: {
                changed: 'FIELD',
                name: `field-${index}`,
                setTo: true,
            },
        }));

        render(
            <ComponentAccessAudit
                audit={{
                    userName: 'client-a',
                    auditRecord,
                }}
            />
        );

        expect(screen.getByText('Viser de siste 10 endringene')).toBeInTheDocument();
        expect(screen.getAllByRole('row')).toHaveLength(11);

        fireEvent.click(screen.getByRole('button', { name: 'Vis full logg' }));

        expect(screen.getByText('Endringslogg for client-a (12 endringer)')).toBeInTheDocument();
        expect(screen.getAllByRole('row')).toHaveLength(13);
    });
});
