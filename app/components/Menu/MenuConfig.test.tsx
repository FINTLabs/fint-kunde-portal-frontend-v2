import { describe, expect, it, vi } from 'vitest';

import { getFooterLinks, getFooterLinksNotLoggedIn, getNovariMenu } from './MenuConfig';

const mockHelpData = [
    { id: 'contacts', shortDescription: 'contacts help' },
    { id: 'components', shortDescription: 'components help' },
    { id: 'adapter', shortDescription: 'adapter help' },
    { id: 'klienter', shortDescription: 'clients help' },
    { id: 'assets', shortDescription: 'assets help' },
    { id: 'hendelseslogg', shortDescription: 'event log help' },
    { id: 'basistest', shortDescription: 'basic test help' },
    { id: 'relasjonstest', shortDescription: 'relation test help' },
];

vi.mock('~/routes/help/HelpData', () => ({
    getHelpData: vi.fn(() => mockHelpData),
}));

const t = ((key: string) => key) as any;

describe('MenuConfig', () => {
    it('returns expected footer links for logged in users', () => {
        const links = getFooterLinks(t);

        expect(links).toHaveLength(5);
        expect(links).toEqual(
            expect.arrayContaining([
                { label: 'footer.incidents', href: 'https://novari.no/driftsmeldinger/' },
                { label: 'footer.support', href: 'http://support.novari.no' },
                { label: 'footer.help', href: 'http://fintlabs.no' },
                { label: 'footer.glossary', href: '/help/' },
                { label: 'footer.testClient', href: 'https://api.felleskomponent.no/' },
            ])
        );
    });

    it('returns expected footer links for not logged in users', () => {
        const links = getFooterLinksNotLoggedIn(t);

        expect(links).toHaveLength(4);
        expect(links.find((link) => link.label === 'footer.glossary')).toBeUndefined();
    });

    it('builds menu items with descriptions from help data', () => {
        const menu = getNovariMenu(t);

        expect(menu).toHaveLength(3);
        expect(menu[0]).toMatchObject({
            action: '/',
            label: 'menu.dashboard',
            description: 'menu.dashboardDescription',
        });

        const accessMenu = menu[1];
        expect(accessMenu.label).toBe('menu.access');
        expect(accessMenu.submenu).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    action: '/kontakter',
                    label: 'menu.contacts',
                    role: 'ROLE_ORGANISATION',
                    description: 'contacts help',
                }),
                expect.objectContaining({
                    action: '/klienter',
                    label: 'menu.clients',
                    role: 'ROLE_CLIENT',
                    description: 'clients help',
                    notification: true,
                }),
            ])
        );

        const healthMenu = menu[2];
        expect(healthMenu.label).toBe('menu.health');
        expect(healthMenu.submenu).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    action: '/hendelseslogg',
                    label: 'menu.eventLog',
                    description: 'event log help',
                }),
                expect.objectContaining({
                    action: '/linkwalker',
                    label: 'Link-walker',
                    role: 'ROLE_FINTLABS_TEST',
                    description: 'relation test help',
                }),
            ])
        );
    });
});
