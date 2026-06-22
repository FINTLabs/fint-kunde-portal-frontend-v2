import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProblemTypeEntries } from './ProblemTypeEntries';

describe('ProblemTypeEntries', () => {
    it('renders problem types sorted by count descending', () => {
        render(
            <ProblemTypeEntries
                byProblemType={{
                    'unknown-link': 2,
                    'missing-resource': 8,
                }}
            />
        );

        expect(screen.getByText('Problemtyper')).toBeInTheDocument();
        expect(screen.getByText('10 registrerte problemer')).toBeInTheDocument();
        expect(screen.getByText('missing-resource')).toBeInTheDocument();
        expect(screen.getByText('unknown-link')).toBeInTheDocument();
        expect(screen.getByText('8')).toBeInTheDocument();
        expect(screen.getByText('80%')).toBeInTheDocument();
    });

    it('shows empty state when there are no problem types', () => {
        render(<ProblemTypeEntries byProblemType={{}} />);

        expect(screen.getByText('Ingen problemtyper registrert.')).toBeInTheDocument();
    });
});
