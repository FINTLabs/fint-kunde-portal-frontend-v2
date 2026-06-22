import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import CustomErrorNoAccess from './CustomErrorNoAccess';

describe('CustomErrorNoAccess', () => {
    it('renders access denied message and dashboard link', () => {
        render(<CustomErrorNoAccess />);

        expect(
            screen.getByRole('heading', {
                name: /Du har ikke tilgang til dette området\./,
            })
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Gå til Kundeportalen Dashboard' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Gå til Kundeportalen Dashboard' })).toHaveAttribute(
            'href',
            '/'
        );
    });
});
