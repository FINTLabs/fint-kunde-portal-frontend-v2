import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import CustomErrorNoOrg from './CustomErrorNoOrg';

describe('CustomErrorNoOrg', () => {
    it('renders organization access guidance message', () => {
        render(<CustomErrorNoOrg />);

        expect(
            screen.getByRole('heading', {
                name: /Du er ikke tilknyttet en organisasjon\./,
            })
        ).toBeInTheDocument();
    });
});
