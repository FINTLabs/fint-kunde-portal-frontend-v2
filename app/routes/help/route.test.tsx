import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGetHelpData } = vi.hoisted(() => ({
    mockGetHelpData: vi.fn(),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

vi.mock('~/components/shared/breadcrumbs', () => ({
    default: ({ breadcrumbs }: { breadcrumbs: { name: string }[] }) => (
        <div data-testid="breadcrumbs">{breadcrumbs.map((b) => b.name).join(' > ')}</div>
    ),
}));

vi.mock('~/components/shared/InternalPageHeader', () => ({
    InternalPageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock('~/routes/help/HelpData', async () => {
    const actual =
        await vi.importActual<typeof import('~/routes/help/HelpData')>('~/routes/help/HelpData');
    return {
        ...actual,
        getHelpData: (...args: any[]) => mockGetHelpData(...args),
    };
});

import Index, { meta } from './route';

describe('help route', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetHelpData.mockReturnValue([
            {
                id: 'basistest',
                title: 'help.basistest.title',
                shortDescription: 'help.basistest.shortDescription',
                description: 'first paragraphLINE_BREAK_HEREsecond paragraph',
            },
            {
                id: 'contacts',
                title: 'help.contacts.title',
                shortDescription: 'help.contacts.shortDescription',
                description: 'single paragraph',
            },
        ]);
    });

    it('meta returns title and description', () => {
        expect(meta({} as any)).toEqual([
            { title: 'Hjelpe' },
            { name: 'description', content: 'Hjelpeliste over hjelpetekster' },
        ]);
    });

    it('renders breadcrumbs, header, and accordion items', () => {
        render(<Index />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('mainRoutes.help.breadcrumb');
        expect(screen.getByRole('heading', { name: 'mainRoutes.help.title' })).toBeInTheDocument();

        // Accordion headers should include our mocked titles
        expect(screen.getByText('help.basistest.title')).toBeInTheDocument();
        expect(screen.getByText('help.contacts.title')).toBeInTheDocument();
    });

    it('splits description by LINE_BREAK_HERE into multiple paragraphs', () => {
        render(<Index />);

        expect(screen.getByText('first paragraph')).toBeInTheDocument();
        expect(screen.getByText('second paragraph')).toBeInTheDocument();
        expect(screen.getByText('single paragraph')).toBeInTheDocument();
    });
});
