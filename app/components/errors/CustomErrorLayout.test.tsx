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
    NovariHeader: ({
        appName,
        displayName,
        isLoggedIn,
        menu,
    }: {
        appName: string;
        displayName: string;
        isLoggedIn: boolean;
        menu: Array<{ name: string; url: string }>;
    }) => (
        <div
            data-testid="novari-header"
            data-is-logged-in={isLoggedIn}
            data-menu-count={menu.length}
        >
            {appName}:{displayName}
        </div>
    ),
    NovariFooter: ({ links }: { links: Array<{ label: string; href: string }> }) => (
        <div data-testid="novari-footer">{links.map((link) => link.label).join(',')}</div>
    ),
}));

vi.mock('~/components/Menu/MenuConfig', () => ({
    getNovariMenu: vi.fn(() => [{ name: 'menu.item', url: '/menu-item' }]),
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
        expect(screen.getByTestId('novari-header')).toHaveAttribute('data-is-logged-in', 'true');
        expect(screen.getByTestId('novari-header')).toHaveAttribute('data-menu-count', '1');
        expect(screen.getByTestId('novari-footer')).toHaveTextContent('footer.support,footer.help');
        expect(screen.getByText('child content')).toBeInTheDocument();
    });

    it('hides menu when showMenu is false', () => {
        mockUseTranslation.mockReturnValue({
            t: (key: string) => key,
        });

        render(
            <CustomErrorLayout showMenu={false}>
                <div>child content</div>
            </CustomErrorLayout>
        );

        expect(screen.getByTestId('novari-header')).toHaveAttribute('data-is-logged-in', 'false');
        expect(screen.getByTestId('novari-header')).toHaveAttribute('data-menu-count', '0');
    });
});
