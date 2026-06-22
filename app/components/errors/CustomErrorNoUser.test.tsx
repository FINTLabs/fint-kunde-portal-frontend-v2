import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import CustomErrorNoUser from './CustomErrorNoUser';

describe('CustomErrorNoUser', () => {
    it('renders no-user message and registration action', () => {
        render(<CustomErrorNoUser />);

        expect(
            screen.getByRole('heading', {
                name: 'Du har ikke opprettet bruker.',
            })
        ).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'Trykk her for å opprette konto' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Trykk her for å opprette konto' })).toHaveAttribute(
            'href',
            'https://registrering.felleskomponent.no'
        );
    });
});
