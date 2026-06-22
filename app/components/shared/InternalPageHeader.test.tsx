import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { InternalPageHeader } from './InternalPageHeader';

const { mockUseTranslation, mockGetHelpData } = vi.hoisted(() => ({
    mockUseTranslation: vi.fn(),
    mockGetHelpData: vi.fn(),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => mockUseTranslation(),
}));

vi.mock('~/routes/help/HelpData', () => ({
    getHelpData: (t: unknown) => mockGetHelpData(t),
}));

function MockIcon() {
    return <svg data-testid="header-icon" />;
}

describe('InternalPageHeader', () => {
    it('renders title, icon, help text and children', () => {
        mockUseTranslation.mockReturnValue({ t: (key: string) => key });
        mockGetHelpData.mockReturnValue([{ id: 'adapter', description: 'Adapter help description' }]);

        render(
            <InternalPageHeader title="Adaptere" icon={MockIcon} helpText="adapter">
                <button type="button">Action</button>
            </InternalPageHeader>
        );

        expect(screen.getByRole('heading', { name: 'Adaptere' })).toBeInTheDocument();
        expect(screen.getByTestId('header-icon')).toBeInTheDocument();
        expect(screen.getByText('Adapter help description')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('does not render help text when no matching help item exists', () => {
        mockUseTranslation.mockReturnValue({ t: (key: string) => key });
        mockGetHelpData.mockReturnValue([{ id: 'something-else', description: 'Not shown' }]);

        render(<InternalPageHeader title="Klienter" helpText="clients" />);

        expect(screen.queryByText('Not shown')).not.toBeInTheDocument();
    });
});
