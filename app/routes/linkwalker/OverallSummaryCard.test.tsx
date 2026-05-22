import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { OverallSummaryCard } from './OverallSummaryCard';

describe('OverallSummaryCard', () => {
    it('renders summary metrics and scan timestamp', () => {
        render(
            <OverallSummaryCard
                scanCompletedAt="2024-06-15T12:30:00Z"
                summary={{
                    totalRecords: 1234,
                    totalRefs: 5678,
                    brokenLinkCount: 42,
                    integrityPercent: 96.75,
                    byProblemType: {
                        'missing-resource': 10,
                    },
                    components: [],
                }}
            />
        );

        expect(screen.getByText('Oversikt')).toBeInTheDocument();
        expect(screen.getByText(/Skannet:/)).toBeInTheDocument();
        expect(screen.getByText('1,234')).toBeInTheDocument();
        expect(screen.getByText('5,678')).toBeInTheDocument();
        expect(screen.getByText('42')).toBeInTheDocument();
        expect(screen.getByText('96.75%')).toBeInTheDocument();
        expect(screen.getByLabelText('Link Integrity Progress')).toBeInTheDocument();
        expect(screen.getByText('missing-resource')).toBeInTheDocument();
    });
});
