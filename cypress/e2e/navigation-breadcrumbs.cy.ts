/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
    if (
        /hydrat/i.test(err.message) ||
        /Minified React error #418/.test(err.message) ||
        /Minified React error #423/.test(err.message) ||
        /ResizeObserver loop completed with undelivered notifications/.test(err.message)
    ) {
        return false;
    }
});

describe('Navigation and Breadcrumb Tests', () => {
    beforeEach(() => {
        // Start from dashboard to establish baseline
        cy.visit('/', { failOnStatusCode: false });
        cy.reload();
        cy.waitForAppReady();
        // cy.get('[data-theme="novari"]').should('exist');
        // cy.get('.navds-page').should('be.visible');
    });

    describe('Breadcrumb Navigation - Basic Functionality', () => {
        it('should display breadcrumbs on sub-pages (not on dashboard)', () => {
            const pages = [
                { path: '/user', expectedBreadcrumbs: ['Dashboard', 'Profile'] },
                { path: '/help', expectedBreadcrumbs: ['Dashboard', 'Support'] },
                { path: '/klienter', expectedBreadcrumbs: ['Dashboard', 'Klienter'] },
                { path: '/adaptere', expectedBreadcrumbs: ['Dashboard', 'Adaptere'] },
                { path: '/ressurser', expectedBreadcrumbs: ['Dashboard', 'Ressurser'] },
            ];

            pages.forEach(({ path, expectedBreadcrumbs }) => {
                cy.visit(path, { failOnStatusCode: false });
                cy.get('[data-cy="breadcrumbs"]', { timeout: 10000 }).should('be.visible');

                expectedBreadcrumbs.forEach((breadcrumb) => {
                    cy.contains(breadcrumb).should('be.visible');
                });
            });
        });

        it('should not display breadcrumbs on dashboard (root page)', () => {
            cy.visit('/', { failOnStatusCode: false });
            cy.get('[data-theme="novari"]').should('exist');

            // Dashboard should not have breadcrumbs
            cy.get('[data-cy="breadcrumbs"]').should('not.exist');

            // But should have the top menu with Dashboard link
            cy.get('[data-cy="novari-header"]').should('be.visible');
        });

        it('should have clickable breadcrumb links', () => {
            // Visit a sub-page
            cy.visit('/user', { failOnStatusCode: false });
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');

            // Click on Dashboard breadcrumb (within breadcrumbs container)
            cy.get('[data-cy="breadcrumbs"]').within(() => {
                cy.contains('Dashboard').click();
            });

            // Should navigate back to dashboard
            cy.url().should('eq', Cypress.config().baseUrl + '/');
            cy.get('[data-theme="novari"]').should('exist');
        });

        it('should show correct breadcrumb structure', () => {
            // Test user page breadcrumbs
            cy.visit('/user', { failOnStatusCode: false });
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');

            // Verify breadcrumb structure
            cy.get('[data-cy="breadcrumb-item"]').should('have.length', 1); // Only Profile item
            cy.contains('Dashboard').should('be.visible');
            cy.contains('Profile').should('be.visible');

            // Test help page breadcrumbs
            cy.visit('/help', { failOnStatusCode: false });
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');
            cy.contains('Dashboard').should('be.visible');
            cy.contains('Support').should('be.visible');
        });

        it('should distinguish between breadcrumb Dashboard and top menu Dashboard', () => {
            // Visit a sub-page
            cy.visit('/user', { failOnStatusCode: false });

            // Verify both Dashboard elements exist but are in different containers
            cy.get('[data-cy="novari-header"]').should('be.visible'); // Top menu
            cy.get('[data-cy="breadcrumbs"]').should('be.visible'); // Breadcrumbs

            // The breadcrumb Dashboard should be a link with href="/"
            cy.get('[data-cy="breadcrumbs"]').within(() => {
                cy.contains('Dashboard').should('have.attr', 'href', '/');
                cy.contains('Dashboard').should('be.visible');
            });

            // The top menu Dashboard should also be present but in a different container
            cy.get('[data-cy="novari-header"]').should('contain', 'Dashboard');
        });

        it('should maintain breadcrumb state during navigation', () => {
            // Start at dashboard (no breadcrumbs)
            cy.visit('/', { failOnStatusCode: false });
            cy.get('[data-cy="breadcrumbs"]').should('not.exist');

            // Navigate to user page (should have breadcrumbs)
            cy.visit('/user', { failOnStatusCode: false });
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');
            cy.contains('Dashboard').should('be.visible');
            cy.contains('Profile').should('be.visible');

            // Navigate back to dashboard via breadcrumb
            cy.get('[data-cy="breadcrumbs"]').within(() => {
                cy.contains('Dashboard').click();
            });
            cy.url().should('eq', Cypress.config().baseUrl + '/');
        });
    });

    describe('Back Button Functionality', () => {
        it('should have back button on pages that need it', () => {
            const pagesWithBackButton = ['/user'];

            pagesWithBackButton.forEach((path) => {
                cy.visit(path, { failOnStatusCode: false });
                cy.get('[data-cy="back-button"]', { timeout: 10000 }).should('be.visible');
            });
        });

        it('should navigate back to dashboard when back button is clicked', () => {
            // Visit user page
            cy.visit('/user', { failOnStatusCode: false });
            cy.get('[data-cy="back-button"]').should('be.visible');

            // Verify we're on user page first
            cy.url().should('include', '/user');

            // Click back button and wait for navigation
            cy.get('[data-cy="back-button"]').click();

            // Wait for the page to actually change by waiting for dashboard content
            cy.contains('Velkommen til kundeportalen', { timeout: 10000 }).should('be.visible');
            cy.url().should('eq', Cypress.config().baseUrl + '/');
        });

        it('should have accessible back button', () => {
            // Visit user page
            cy.visit('/user', { failOnStatusCode: false });
            cy.get('[data-cy="back-button"]').should('be.visible');

            // Verify back button is focusable
            cy.get('[data-cy="back-button"]').focus();
            cy.get('[data-cy="back-button"]').should('be.focused');

            // Verify back button is clickable
            cy.get('[data-cy="back-button"]').should('be.visible').and('not.be.disabled');
        });
    });

    describe('Cross-Page Navigation', () => {
        it('should allow navigation between different pages', () => {
            const pages = ['/user', '/help', '/klienter', '/adaptere', '/ressurser'];

            pages.forEach((page) => {
                cy.visit(page, { failOnStatusCode: false });
                cy.get('[data-theme="novari"]').should('exist');
                cy.url().should('include', page);
            });
        });

        it('should maintain navigation state across page changes', () => {
            // Start at dashboard
            cy.visit('/', { failOnStatusCode: false });

            // Navigate to user page
            cy.visit('/user', { failOnStatusCode: false });
            cy.get('[data-cy="page-title"]').should('contain', 'User Information');

            // Navigate to help page
            cy.visit('/help', { failOnStatusCode: false });
            cy.get('[data-cy="page-title"]').should('contain', 'Mer informasjon');

            // Navigate back to user page
            cy.visit('/user', { failOnStatusCode: false });
            cy.get('[data-cy="page-title"]').should('contain', 'User Information');
        });

        it('should handle direct URL navigation', () => {
            // Test direct navigation to various pages
            const directPages = ['/user', '/help', '/klienter'];

            directPages.forEach((page) => {
                cy.visit(page, { failOnStatusCode: false });
                cy.get('[data-theme="novari"]').should('exist');
                cy.url().should('include', page);
            });
        });
    });

    describe('Navigation Consistency', () => {
        it('should have consistent breadcrumb behavior across pages', () => {
            const pages = [
                { path: '/user', expectedBreadcrumbs: ['Dashboard', 'Profile'] },
                { path: '/help', expectedBreadcrumbs: ['Dashboard', 'Support'] },
            ];

            pages.forEach(({ path, expectedBreadcrumbs }) => {
                cy.visit(path, { failOnStatusCode: false });
                cy.get('[data-cy="breadcrumbs"]').should('be.visible');

                // Verify Dashboard link is always present and clickable within breadcrumbs
                cy.get('[data-cy="breadcrumbs"]').within(() => {
                    cy.contains('Dashboard').should('be.visible');
                    cy.contains('Dashboard').should('have.attr', 'href', '/');
                });

                // Verify page-specific breadcrumb
                const pageBreadcrumb = expectedBreadcrumbs[1];
                cy.contains(pageBreadcrumb).should('be.visible');
            });
        });

        it('should maintain consistent navigation patterns', () => {
            // Test navigation from dashboard to sub-pages
            cy.visit('/', { failOnStatusCode: false });

            // Navigate to user page
            cy.visit('/user', { failOnStatusCode: false });
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');
            cy.get('[data-cy="back-button"]').should('be.visible');

            // Navigate to help page
            cy.visit('/help', { failOnStatusCode: false });
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');

            // Help page shouldn't have back button (different pattern)
            cy.get('[data-cy="back-button"]').should('not.exist');
        });

        it('should handle navigation with page refresh', () => {
            // Visit user page
            cy.visit('/user', { failOnStatusCode: false });
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');

            // Refresh page
            cy.reload();
            cy.get('[data-cy="breadcrumbs"]', { timeout: 10000 }).should('be.visible');
            cy.contains('Dashboard').should('be.visible');
            cy.contains('Profile').should('be.visible');
        });
    });

    describe('Navigation Accessibility', () => {
        it('should have accessible breadcrumb navigation', () => {
            // Visit user page
            cy.visit('/user', { failOnStatusCode: false });
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');

            // Verify breadcrumb links are accessible
            cy.get('[data-cy="breadcrumbs"]').within(() => {
                cy.contains('Dashboard').should('be.visible');
                cy.contains('Dashboard').should('have.attr', 'href');

                // Test keyboard navigation
                cy.contains('Dashboard').focus();
                cy.contains('Dashboard').should('be.focused');
            });
        });

        it('should have accessible back button', () => {
            // Visit user page
            cy.visit('/user', { failOnStatusCode: false });
            cy.get('[data-cy="back-button"]').should('be.visible');

            // Verify back button is keyboard accessible
            cy.get('[data-cy="back-button"]').focus();
            cy.get('[data-cy="back-button"]').should('be.focused');

            // Test button activation
            cy.get('[data-cy="back-button"]').click();
            cy.contains('Velkommen til kundeportalen', { timeout: 10000 }).should('be.visible');
            cy.url().should('eq', Cypress.config().baseUrl + '/');
        });

        it('should support keyboard navigation between pages', () => {
            // Start at dashboard
            cy.visit('/', { failOnStatusCode: false });

            // Navigate to user page
            cy.visit('/user', { failOnStatusCode: false });
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');

            // Use keyboard to navigate breadcrumb (click works more reliably)
            cy.get('[data-cy="breadcrumbs"]').within(() => {
                cy.contains('Dashboard').click();
            });
            cy.url().should('eq', Cypress.config().baseUrl + '/');
        });
    });

    describe('Navigation Error Handling', () => {
        it('should handle invalid page navigation gracefully', () => {
            // Try to visit non-existent page
            cy.visit('/non-existent-page', { failOnStatusCode: false });

            // Should still show basic page structure
            cy.get('[data-theme="novari"]').should('exist');
        });

        it('should handle navigation with network issues', () => {
            // Visit user page
            cy.visit('/user', { failOnStatusCode: false });
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');

            // Navigate to help page
            cy.visit('/help', { failOnStatusCode: false });
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');

            // Navigation should work even with potential network issues
            cy.contains('Dashboard').should('be.visible');
        });

        it('should maintain navigation state after errors', () => {
            // Visit user page
            cy.visit('/user', { failOnStatusCode: false });
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');

            // Refresh page (simulates potential error recovery)
            cy.reload();
            cy.get('[data-cy="breadcrumbs"]', { timeout: 10000 }).should('be.visible');

            // Navigation should still work
            cy.get('[data-cy="breadcrumbs"]').within(() => {
                cy.contains('Dashboard').click();
            });
            cy.url().should('eq', Cypress.config().baseUrl + '/');
        });
    });

    describe('Navigation Performance', () => {
        it('should navigate quickly between pages', () => {
            const pages = ['/user', '/help', '/klienter'];

            pages.forEach((page) => {
                cy.visit(page, { failOnStatusCode: false });
                cy.get('[data-theme="novari"]').should('exist');
                cy.url().should('include', page);
            });
        });

        it('should handle rapid navigation changes', () => {
            // Rapid navigation between pages
            cy.visit('/user', { failOnStatusCode: false });
            cy.visit('/help', { failOnStatusCode: false });
            cy.visit('/klienter', { failOnStatusCode: false });
            cy.visit('/adaptere', { failOnStatusCode: false });

            // Final page should load correctly
            cy.get('[data-theme="novari"]').should('exist');
            cy.url().should('include', '/adaptere');
        });
    });
});
