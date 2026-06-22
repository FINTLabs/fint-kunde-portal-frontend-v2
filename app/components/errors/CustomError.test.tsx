import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import CustomErrorPage from './CustomError';

describe('CustomErrorPage', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('renders default status and content', () => {
        render(<CustomErrorPage />);

        expect(screen.getByText('Statuskode 500')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Beklager, noe gikk galt.' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Gå til Kundeportalen Dashboard' })).toBeInTheDocument();
        expect(screen.getByText('Feil-data: 500 - unknown')).toBeInTheDocument();
    });

    it('formats JSON error data when valid json is provided', () => {
        render(<CustomErrorPage statusCode={502} errorData={'{"message":"Oops"}'} />);

        expect(screen.getByText(/Feil-data: 502 - \{/)).toBeInTheDocument();
        expect(screen.getByText(/"message": "Oops"/)).toBeInTheDocument();
    });

    it('hides error data section for 403 status', () => {
        render(<CustomErrorPage statusCode={403} statusTitle="Forbidden" errorData="secret" />);

        expect(screen.queryByText(/Feil-data:/)).not.toBeInTheDocument();
    });

    it('renders action links for refresh and back navigation', () => {
        render(<CustomErrorPage />);

        const reloadLink = screen.getByRole('link', { name: 'laste siden på nytt' });
        const backLink = screen.getByRole('link', { name: 'gå tilbake til forrige side' });

        expect(reloadLink).toHaveAttribute('href', '#');
        expect(backLink).toHaveAttribute('href', '#');

    });
});
