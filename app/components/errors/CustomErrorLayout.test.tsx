import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CustomErrorLayout } from './CustomErrorLayout';

const { mockUseTranslation } = vi.hoisted(() => ({
    mockUseTranslation: vi.fn(),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => mockUseTranslation(),
}));

vi.mock('novari-frontend-components', () => ({
    NovariHeader: ({ appName, displayName }: { appName: string; displayName: string }) => (
        <div data-testid="novari-header">
            {appName}:{displayName}
        </div>
    ),
    NovariFooter: ({ links }: { links: Array<{ label: string; href: string }> }) => (
        <div data-testid="novari-footer">{links.map((link) => link.label).join(',')}</div>
    ),
}));

vi.mock('~/components/Menu/MenuConfig', () => ({
    getFooterLinksNotLoggedIn: vi.fn(() => [
        { label: 'footer.support', href: 'http://support.novari.no' },
        { label: 'footer.help', href: 'http://fintlabs.no' },
    ]),
}));

describe('CustomErrorLayout', () => {
    it('renders header, footer and children content', () => {
        mockUseTranslation.mockReturnValue({
            t: (key: string) => key,
        });

        render(
            <CustomErrorLayout>
                <div>child content</div>
            </CustomErrorLayout>
        );

        expect(screen.getByTestId('novari-header')).toHaveTextContent('root.appName:Error');
        expect(screen.getByTestId('novari-footer')).toHaveTextContent('footer.support,footer.help');
        expect(screen.getByText('child content')).toBeInTheDocument();
    });
});
